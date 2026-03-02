import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const port = Number(process.env.PORT);
  const swaggerUrl = process.env.SWAGGER_URL;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  // 設置全域的未處理 Promise 拒絕處理器
  process.on('unhandledRejection', (reason, promise) => {
    const logger = new Logger('UnhandledReRejection');
    logger.error('捕捉到一個未處理的 Promise 拒絕:', reason);
    logger.error('Promise :', promise);
  });

  // swagger option
  const config = new DocumentBuilder()
    .setTitle('Lereve Website API DOC')
    .setVersion('0.0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer(`${swaggerUrl}/`)
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, UsersModule],
  });
  SwaggerModule.setup('swagger', app, document);

  const server = await app.listen(port, '0.0.0.0', () =>
    Logger.log(`lereveWebsite is listening port: ${port}`),
  );

  server.setTimeout(Number(process.env.REQUEST_TIMEOUT_SETTING));
}
void bootstrap();
