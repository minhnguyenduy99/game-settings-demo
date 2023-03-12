import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DATABASE_CONFIG } from './app.constants'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SettingsModule } from './settings'
import appConfig from './app.config'
import { ApiDocsModule } from './apidocs'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig],
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) =>
				configService.get(DATABASE_CONFIG),
			inject: [ConfigService],
		}),

		// feature modules
		SettingsModule,
		ApiDocsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
