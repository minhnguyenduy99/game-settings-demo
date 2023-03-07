import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Req,
	Res,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { ExportService } from '../services/export.service'
import { SettingsService } from '../services/settings.service'
import { extractFileName } from '../utils/extract-file-name.utils'

@Controller('settings')
export class SettingsController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly exportService: ExportService,
	) {}

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

	// create a method to stream file to client in nestjs
	@Get('/export')
	async exportSettingsByTag(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const tag = req.query.tag as string
		const { name, file } = await this.exportService.exportSettingsByTag(tag)
		res.set({
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename=${name}`,
			'Access-Control-Expose-Headers': 'Content-Disposition',
		})
		return new StreamableFile(file)
	}

	// create a method to stream file to client in nestjs
	@Post('/import')
	@UseInterceptors(FileInterceptor('file'))
	async importSettingsByTag(@UploadedFile() file: Express.Multer.File) {
		await this.exportService.importSettings({
			name: extractFileName(file.originalname),
			file: file.buffer,
		})
		return {
			code: 'SUCCESS',
		}
	}
}
