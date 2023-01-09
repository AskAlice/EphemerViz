import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenTelemetryModule } from 'nestjs-otel';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import database from './config/database';
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});
@Module({
  imports: [
    OpenTelemetryModuleConfig,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [database],
    }),
    LoggerModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
