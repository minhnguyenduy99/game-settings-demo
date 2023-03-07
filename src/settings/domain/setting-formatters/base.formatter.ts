import {
	IFileFormatter,
	RawSetting,
} from '../file-formatters/file-formatter.interfaces'

export interface GameSetting {
	type: string
	settings: object
}

export interface IGameSettingFormatter {
	toGameSetting(rawSetting: RawSetting): Promise<GameSetting>
	toRawSetting(setting: GameSetting): Promise<RawSetting>
}
