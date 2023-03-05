import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	AddSettingsDTO,
	TagSettingVersionDTO,
	UpdateSettingsDTO,
} from '../dtos/settings-service.dtos'
import { SettingsService } from '../services/settings.service'

@Controller('tags')
export class TagController {
	constructor(private readonly settingsService: SettingsService) {}

	@Post()
	async tagSettingVersion(@Body() dto: TagSettingVersionDTO) {
		await this.settingsService.tagSettingVersion(dto)
		return {
			code: 'SUCCESS',
		}
	}
}
