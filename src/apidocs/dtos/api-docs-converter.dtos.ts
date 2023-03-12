export class ApiDocsConvertDTO {
	file: string
	from: string
	to: string
}

export class ApiDocsConvertResult {
	contentType: string
	buffer: Buffer
}
