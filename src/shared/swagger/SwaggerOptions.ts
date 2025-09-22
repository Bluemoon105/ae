import { DocumentBuilder, OpenAPIObject, SwaggerCustomOptions } from '@nestjs/swagger';

const swaggerCustomOptions = (): SwaggerCustomOptions => ({ customSiteTitle: 'ae API' });

const swaggerOption = (): Omit<OpenAPIObject, 'paths'> => {
  const options = new DocumentBuilder()
    .setTitle('ae API')
    .setDescription('ae 명세서')
    .setVersion('1.0.0')
    .addTag('Auth', '인증 관리')
    .addTag('Board', '게시판 관리')
    .addTag('Users', '사용자 관리')
    .addBearerAuth()
    .build();

  return options;
};

const docsOptions = {
  swagger: swaggerOption,
  swaggerCustom: swaggerCustomOptions,
};

export default docsOptions;
