import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { HttpExceptionFilter } from './app.exception-filter'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.enableCors({
		origin: '*',
	})
	app.useGlobalFilters(new HttpExceptionFilter())

	const host = process.env.HOST
	const port = parseInt(process.env.PORT)
	await app.listen(port, host, () => {
		Logger.log(`Application started at ${host}:${port}`)
	})
}
bootstrap()
