import writeXlsxFile from 'write-excel-file/node'
import { BaseFormatter } from './base.formatter'

export class KeyValueFormatter extends BaseFormatter {
	async format(file: Buffer): Promise<any> {
		const rows = await this.convertFileToObject(file)
		rows.shift()
		const settingObj = {}
		rows.forEach((row) => {
			const [key, value] = row
			settingObj[key.toString()] = value
		})
		return settingObj
	}

	async toFile(setting: any): Promise<Buffer> {
		const headers = [
			{
				value: 'Key',
			},
			{
				value: 'Value',
			},
		]
		const rows = Object.entries(setting).map((entry) =>
			entry.map((cell) => ({ value: cell })),
		)
		rows.unshift(headers)
		const buffer = await writeXlsxFile(rows as any[], {
			buffer: true,
		})
		return buffer
	}
}
