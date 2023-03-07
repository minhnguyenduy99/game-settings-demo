import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsController, TagController } from './controllers'
import { GameSettingService } from './domain'
import {
	ReadonlySettingOrmEntity,
	SettingOrmEntity,
	SettingVersionOrmEntity,
	TagOrmEntity,
} from './models'
import { ExportService } from './services/export.service'
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
	providers: [SettingsService, ExportService, GameSettingService],
	controllers: [SettingsController, TagController],
})
export class SettingsModule {}
