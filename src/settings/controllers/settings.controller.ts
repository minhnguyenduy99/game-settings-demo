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
import { AddSettingsDTO } from '../dtos/settings-service.dtos'
import { SettingsService } from '../services/settings.service'

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async addNewSetting(
		@UploadedFile() file: any,
		@Body() settings: AddSettingsDTO,
	) {
		await this.settingsService.uploadSetting({
			...settings,
			file: file,
		})
		return {
			code: 'SUCCESS',
		}
	}

	// create a method to handle the GET request to /settings
	@Get()
	async getAllSettings() {
		const settings = await this.settingsService.getAllSettings()
		return {
			code: 'SUCCESS',
			data: settings,
		}
	}
}
