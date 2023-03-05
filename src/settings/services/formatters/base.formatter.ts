import readXlsxFile from 'read-excel-file/node'

export abstract class BaseFormatter {
	protected async convertFileToObject(file: Buffer) {
		const rows = await readXlsxFile(file)
		return rows
	}

	abstract format(file: Buffer): Promise<any>
	abstract toFile(setting: any): Promise<Buffer>
}
