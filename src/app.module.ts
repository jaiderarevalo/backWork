import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      //forRoot carga configuracion de forma estatica
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      // forRootAsync  si espera una promesa al cargar traer un archivo
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get('DB_USERNAME'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_DATABASE'),
        synchronize: false,
        migrationsRun: true,
        migrations: ['src/migrations/*.ts'],
        cli: { migrationsDir: 'src/migrations' },
        charset: 'utf8mb4',
        entities: [User],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
