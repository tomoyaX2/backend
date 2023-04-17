import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Scrapper')
    .setDescription('Scrapper API schema')
    .setVersion('1.0')
    .addServer(process.env.SWAGGER_URL || '/backend')
    .addBearerAuth({ type: 'apiKey', name: 'access_token', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
