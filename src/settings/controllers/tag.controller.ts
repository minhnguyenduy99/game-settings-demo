import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	StreamableFile,
	UseInterceptors,
} from '@nestjs/common'
import { Req, Res } from '@nestjs/common/decorators'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { TagSettingVersionDTO } from '../dtos/settings-service.dtos'
import { ExportService } from '../services/export.service'
import { SettingsService } from '../services/settings.service'

@Controller('tags')
export class TagController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly exportService: ExportService,
	) {}

	@Post()
	async tagSettingVersion(@Body() dto: TagSettingVersionDTO) {
		await this.settingsService.tagSettingVersion(dto)
		return {
			code: 'SUCCESS',
		}
	}

	// write a GET method to handle the GET request all tags
	@Get()
	async getAllTags() {
		const tags = await this.settingsService.getAllTags()
		return {
			code: 'SUCCESS',
			data: tags,
		}
	}

	@Get('/:tag')
	async getTag(@Param('tag') tag: string) {
		const tagData = await this.settingsService.getSettingsOfATag(tag)
		return {
			code: 'SUCCESS',
			data: tagData,
		}
	}

	// create a method to stream file to client in nestjs
	@Get('/:tag/export')
	async exportSettingsByTag(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const tag = req.params.tag
		const { name, file } = await this.exportService.exportSettingsByTag(tag)
		res.set({
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename=${name}`,
			'Access-Control-Expose-Headers': 'Content-Disposition',
		})
		return new StreamableFile(file)
	}
}
