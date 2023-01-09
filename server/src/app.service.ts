import { BadRequestException, Injectable } from '@nestjs/common';
import type { Ephemeris, Mass } from '@prisma/client';
import { Span, TraceService } from 'nestjs-otel';
import { UploadResponseDto } from './app.dto';
import { PrismaService } from './prisma/prisma.service';
import fastify = require('fastify');
import xml2json = require('xml2js');
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService, private tracer: TraceService) {}
  @Span()
  getHello(): string | undefined {
    return 'Hello World!';
  }

  dateFromDay(year, day): Date {
    const date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }

  @Span()
  async processXML(file): Promise<{
    Name: string;
    ID: string;
    Orbiting: Mass;
    locationData: any;
  }> {
    const contents = String(await file.toBuffer());
    const d = await xml2json.parseStringPromise(contents);

    // this isn't pretty but neither is XML
    const metadata = d?.ndm?.oem[0]?.body[0]?.segment[0]?.metadata[0];
    const locationDataRaw =
      d?.ndm?.oem[0]?.body[0]?.segment[0]?.data[0]?.stateVector;
    const Name = metadata?.OBJECT_NAME[0];
    const ID = metadata?.OBJECT_ID[0];
    const Orbiting = metadata?.CENTER_NAME[0].toUpperCase();
    let locationData = {};
    locationDataRaw?.forEach((v) => {
      // This differs from iso as it uses day number of the year
      //2022-049T12:00:00.000Z
      const epoch = v?.['EPOCH']?.[0];

      const { year, day, hour, minute, second, ms } = epoch.match(
        /(?<year>\d{4})-(?<day>\d{3})T(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2}).(?<ms>\d{3})Z/,
      ).groups;

      let date = this.dateFromDay(year, day);

      date = new Date(
        date.setUTCHours(
          Number(hour),
          Number(minute),
          Number(second),
          Number(ms),
        ),
      );
      const eph: Omit<Ephemeris, 'ID'> = {
        Epoch: date,
        x: Number(v?.X?.[0]?.['_']) / 100, // scales the points for three.js so that 1km = 10 meters
        y: Number(v?.Y?.[0]?.['_']) / 100,
        z: Number(v?.Z?.[0]?.['_']) / 100,
      };
      locationData = { ...locationData, [`${date.getUTCSeconds()}`]: eph };
    });

    return { Name, ID, Orbiting, locationData };
  }

  @Span()
  async postUploadEphemeris(
    req: fastify.FastifyRequest,
    res: fastify.FastifyReply<any>,
  ): Promise<string> {
    if (!req.isMultipart()) {
      res.send(
        new BadRequestException(
          new UploadResponseDto(400, undefined, 'Bad request'),
        ),
      );
      return;
    }
    const data = await req.file({ limits: { fileSize: 5000000 } });

    const { locationData, Name, ID, Orbiting } = await this.processXML(data);
    // very basic validation of the xml file's  contents.
    if (
      Object.keys(locationData).length > 0 &&
      typeof Name === 'string' &&
      typeof ID === 'string'
    ) {
      const span = this.tracer.startSpan('prisma.satellite.upsert');
      try {
        await this.prisma.satellite.upsert({
          where: {
            ID,
          },
          create: {
            ID,
            Name,
            Orbiting,
            Ephemeris: {
              create: Object.values(locationData) as Omit<Ephemeris, 'ID'>[],
            },
          },
          update: {
            Name,
            Orbiting,
            Ephemeris: {
              create: Object.values(locationData) as Omit<Ephemeris, 'ID'>[],
            },
          },
          include: {
            Ephemeris: true,
          },
        });
      } catch (e) {
        if (
          typeof (e as any)?.message.match(/.*Unique constraint.*/).length !==
          'undefined'
        ) {
          res.send(
            new BadRequestException(
              new UploadResponseDto(
                400,
                undefined,
                'Your dataset contains data that overlaps existing data in the db, try another file.',
              ),
            ),
          );
        } else {
          res.send(
            new BadRequestException(
              new UploadResponseDto(400, undefined, `Error with the database`),
            ),
          );
        }
      }
      span.end();
      // this.prisma.onModuleInit();
      res.send(JSON.stringify({ Name, ID, Orbiting, locationData }));
      return;
    }
    return;
  }
}
