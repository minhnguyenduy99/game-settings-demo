import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()

		console.error(exception)

		response.status(500).json({
			code: 'ERROR',
			message: exception.message,
		})
	}
}
