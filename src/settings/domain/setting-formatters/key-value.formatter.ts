import { RawSetting } from '../file-formatters/file-formatter.interfaces'
import { GameSetting, IGameSettingFormatter } from './base.formatter'

export class KeyValueFormatter implements IGameSettingFormatter {
	async toGameSetting(rawSetting: RawSetting): Promise<GameSetting> {
		const { type, settingRows } = rawSetting
		const settingObj = {}
		settingRows.forEach((row) => {
			const [key, value] = row
			settingObj[key.toString()] = value
		})
		return {
			type,
			settings: settingObj,
		}
	}

	async toRawSetting(setting: GameSetting): Promise<RawSetting> {
		const { type, settings } = setting
		const header = ['key', 'value']
		const settingRows = Object.entries(settings).map((row) => row[1])
		settingRows.unshift(header)
		return {
			type,
			settingRows,
		}
	}
}
