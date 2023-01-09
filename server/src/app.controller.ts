import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Span } from 'nestjs-otel';
import { AppService } from './app.service';
import fastify = require('fastify');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Span()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Span()
  @Get('/ephemeris/:id/:date')
  async getEphemeris(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Param() params,
  ) {
    // todo: implement
    // return this.appService.getEphemerisData(req, res, params);
  }
  /* takes in an XML file from a via multipart form upload, parses it, and upserts the data to the db */
  @Span()
  @Post('/ephemeris/upload')
  async uploadEphemeris(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<string> {
    return this.appService.postUploadEphemeris(req, res);
  }
}
