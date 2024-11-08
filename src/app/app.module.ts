import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [ConfigModule.forRoot(), TasksModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
