import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { FilesCleanupService } from 'src/files-cleanup/files-cleanup.service';
import { FilesModule } from 'src/files/files.module';
import { LoggerMiddleware } from 'src/logger/logger.middleware';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    FilesModule,
    AuthModule,
    UserModule,
    MailModule,
  ],
  controllers: [],
  providers: [FilesCleanupService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
