import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { networkInterfaces } from 'node:os';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;

/** All non-internal IPv4 addresses, so the Swagger URL can be shared on a LAN. */
function lanAddresses(): string[] {
  const addresses: string[] = [];
  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        addresses.push(entry.address);
      }
    }
  }
  return addresses;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors(); // the Expo app calls this API from other origins
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Everything lives under /api/v1 - except GET / which redirects to the Swagger UI.
  app.setGlobalPrefix('api/v1', { exclude: [{ path: '/', method: RequestMethod.GET }] });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vidyora API')
    .setDescription(
      'REST API for the Vidyora learning app: classes, subjects, chapters and student progress. ' +
        'The Class 6-10 curriculum is seeded into PostgreSQL on first start.',
    )
    .setVersion('1.0')
    .addTag('health')
    .addTag('classes')
    .addTag('chapters')
    .addTag('progress')
    .build();
  const swaggerDocument = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, { jsonDocumentUrl: 'docs/json' });

  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  const host = process.env.HOST ?? '0.0.0.0'; // listen on all interfaces so the LAN can reach it
  await app.listen(port, host);

  const logger = new Logger('Vidyora API');
  logger.log(`REST API   -> http://localhost:${port}/api/v1`);
  logger.log(`Swagger UI -> http://localhost:${port}/docs`);
  for (const address of lanAddresses()) {
    logger.log(`Swagger UI from your network -> http://${address}:${port}/docs`);
  }
}

void bootstrap();
