import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import docsOptions from './shared/swagger/SwaggerOptions';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global Prefix 설정
  app.setGlobalPrefix('api');
  // Swagger Custom Options 및 Swagger Options 설정
  const customOption: SwaggerCustomOptions = docsOptions.swaggerCustom();
  const swaggerOptions: Omit<OpenAPIObject, 'paths'> = docsOptions.swagger();

  // Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  // Swagger UI 설정
  SwaggerModule.setup('api', app, document, customOption);
  // CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://amplify.ocs.navy',
      'https://ocs.navy',
      'https://www.ocs.navy',
    ],
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'x-amz-date',
      'x-amz-security-token',
      'x-amz-content-sha256',
    ],
    exposedHeaders: ['ETag', 'x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(3000);
}
bootstrap();