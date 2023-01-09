import fmp from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import otelSDK from './tracing';

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useLogger(app.get(Logger));
  app.register(fmp);
  await app.listen(5555, '0.0.0.0', (err, address) => {
    if (err) {
      console.log('err', err);
      process.exit(1);
    }
    console.log(`server listening on ${address}`);
  });
}
bootstrap();
