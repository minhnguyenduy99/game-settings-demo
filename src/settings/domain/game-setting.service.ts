import { ExcelFileFormatter } from './file-formatters/excel.file-formatter'
import { GameSetting } from './setting-formatters/base.formatter'
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
}
