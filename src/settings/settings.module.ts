import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsController, TagController } from './controllers'
import {
	ReadonlySettingOrmEntity,
	SettingOrmEntity,
	SettingVersionOrmEntity,
	TagOrmEntity,
} from './models'
import { SettingsService } from './services/settings.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			SettingOrmEntity,
			ReadonlySettingOrmEntity,
			SettingVersionOrmEntity,
			TagOrmEntity,
		]),
	],
	providers: [SettingsService],
	controllers: [SettingsController, TagController],
})
export class SettingsModule {}
