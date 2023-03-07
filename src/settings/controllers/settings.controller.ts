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
import { SettingsService } from '../services/settings.service'

@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async addNewSetting(@UploadedFile() file: Express.Multer.File) {
		const fileNameParts = file.originalname.split('.')
		fileNameParts.pop()
		const fileName = fileNameParts.join('.')
		await this.settingsService.uploadSetting({
			name: fileName,
			file: file.buffer,
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
