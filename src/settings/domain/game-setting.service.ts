import { ExcelFileFormatter } from './file-formatters/excel.file-formatter'
import {
	GameSetting,
	IGameSettingFormatter,
} from './setting-formatters/base.formatter'
import { KeyValueFormatter } from './setting-formatters/key-value.formatter'

const GAME_SETTING_TYPES = {
	keyValue: 'key_value',
}

export class GameSettingService {
	async formatFromExcel(file: Buffer): Promise<GameSetting> {
		const fileFormatter = new ExcelFileFormatter()
		const rawSetting = await fileFormatter.toJSON(file)
		switch (rawSetting.type) {
			case GAME_SETTING_TYPES.keyValue: {
				const formatter = new KeyValueFormatter()
				return formatter.toGameSetting(rawSetting)
			}
		}
		return null
	}

	async convertToExcel(gameSetting: GameSetting) {
		const fileFormatter = new ExcelFileFormatter()
		let formatter: IGameSettingFormatter
		switch (gameSetting.type) {
			case GAME_SETTING_TYPES.keyValue:
				formatter = new KeyValueFormatter()
		}
		const rawSetting = await formatter.toRawSetting(gameSetting)
		const file = await fileFormatter.toFile(rawSetting)
		return file
	}
}
