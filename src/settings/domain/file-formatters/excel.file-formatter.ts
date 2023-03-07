import readXlsxFile from 'read-excel-file/node'
import writeXlsxFile from 'write-excel-file/node'
import {
	IFileFormatter,
	RawSetting,
	SettingRow,
} from './file-formatter.interfaces'

export class ExcelFileFormatter implements IFileFormatter {
	async toJSON(file: Buffer): Promise<RawSetting> {
		const rows = await readXlsxFile(file)
		const [typeRow, ...settingRows] = rows
		return {
			type: typeRow[0].toString(),
			settingRows: settingRows as SettingRow[],
		}
	}

	async toFile(setting: RawSetting): Promise<Buffer> {
		const { type, settingRows: settings } = setting
		const typeRow = [
			{
				value: type,
			},
		]
		console.log(settings)
		const rows = settings.map((entry) =>
			entry.map((cell) => ({ value: cell })),
		)
		rows.unshift(typeRow)
		const buffer = await writeXlsxFile(rows as any[], {
			buffer: true,
		})
		return buffer
	}
}
