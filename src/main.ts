import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ConfigService } from "@services/config/config.service";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const docConfig = new DocumentBuilder()
    .setTitle("Nyumi API Documentation")
    .setVersion("1.0")
    .build();
  SwaggerModule.setup(
    "docs",
    app,
    SwaggerModule.createDocument(app, docConfig)
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get("port"));
}
bootstrap();
