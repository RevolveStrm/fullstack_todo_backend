import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as process from "process";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix(process.env.GLOBAL_PREFIX);

    app.useGlobalPipes(
      new ValidationPipe({
          transform: true,
      }),
    );

    await app.listen(process.env.SERVER_PORT);
}
bootstrap();
