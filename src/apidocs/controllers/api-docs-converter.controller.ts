import {
	Controller,
	Post,
	Query,
	Req,
	Res,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { ApiDocsConverterService } from '../services/api-docs-converter.service'
import * as fs from 'fs'
import { promisify } from 'util'

const unlink = promisify(fs.unlink)

@Controller('/docs')
export class ApiDocsConverterController {
	constructor(private readonly apiDocsConverter: ApiDocsConverterService) {}

	@Post('/convert')
	@UseInterceptors(
		FileInterceptor('file', {
			dest: 'temp',
		}),
	)
	async convertApiDocs(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const { from, to, outputFileName } = req.query as any
		const uploadedFileDestination = req.file.path
		const { buffer, contentType } = await this.apiDocsConverter.convert({
			file: uploadedFileDestination,
			from,
			to,
		})
		res.set({
			'Content-Type': contentType,
			'Content-Disposition': `attachment; filename=${outputFileName}`,
			'Access-Control-Expose-Headers': 'Content-Disposition',
		}).status(200)

		// delete file after upload
		unlink(uploadedFileDestination)
			.then(() => {
				console.debug(
					'Uploaded file is deleted: ' + uploadedFileDestination,
				)
			})
			.catch((err) => {
				console.warn(err)
			})
		return new StreamableFile(buffer)
	}
}
