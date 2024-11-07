import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		credentials: true,
		origin: true,
	});

	app.setGlobalPrefix(process.env.GLOBAL_PREFIX);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle(process.env.SWAGGER_DOCUMENT_TITLE)
		.setDescription(process.env.SWAGGER_DOCUMENT_DESCRIPTION)
		.setVersion(process.env.SWAGGER_DOCUMENT_VERSION)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	await app.listen(process.env.SERVER_PORT, () => {
		console.log(`Server is listening on ${process.env.SERVER_PORT} port`);
	});
}

bootstrap();
