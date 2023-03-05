import { BaseFormatter } from './base.formatter'

export class ListFormatter extends BaseFormatter {
	async format(file) {
		const rows = await this.convertFileToObject(file)
		const [headerRow, ...dataRows] = rows
		const items = []

		dataRows.forEach((row) => {
			const rowObj = row.reduce(
				(obj, col, index) => ({
					...obj,
					[headerRow[index].toString()]: col,
				}),
				{},
			)
			items.push(rowObj)
		})
		return items
	}
}
