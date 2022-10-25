import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { ConfigService } from './configs/configs.service';

const configService = new ConfigService()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('Travel buddy App ')
      .setDescription('The travel buddy APIs description')
      .setVersion('1.0')
      .addTag('Travelbuddy APIs')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('api', app, document)

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
  
    app.use(cookieParser())
  
    // app.useGlobalPipes(new ValidationPipe())
  
    process.on('uncaughtException', error => {
      console.log('Uncaught exception happened', error)
    })
  
    await app.listen(
      configService.internalPort,
      configService.internalHost,
      // log cb
      () =>
        console.log(
          `Our app is started at ${configService.internalHost}:${configService.internalPort}`,
        ),
    )
}
bootstrap();
