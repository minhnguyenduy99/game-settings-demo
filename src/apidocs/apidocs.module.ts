import { Module } from '@nestjs/common'
import { ApiDocsConverterController } from './controllers/api-docs-converter.controller'
import { ApiDocsConverterService } from './services/api-docs-converter.service'

@Module({
	providers: [ApiDocsConverterService],
	controllers: [ApiDocsConverterController],
})
export class ApiDocsModule {}
