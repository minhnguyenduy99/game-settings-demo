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
}
