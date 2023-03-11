import { Injectable } from '@nestjs/common'
const p2o = require('postman-to-openapi')
import {
	ApiDocsConvertDTO,
	ApiDocsConvertResult,
} from '../dtos/api-docs-converter.dtos'

export interface ApiDocsConverterServiceConfig {
	outputFolderPath: string
}

@Injectable()
export class ApiDocsConverterService {
	async convert(dto: ApiDocsConvertDTO): Promise<ApiDocsConvertResult> {
		const { file } = dto
		const result = await p2o(file, null)
		const outputBuffer = Buffer.from(result)
		return {
			buffer: outputBuffer,
			contentType: 'text/vnd.yaml',
		}
	}
}
