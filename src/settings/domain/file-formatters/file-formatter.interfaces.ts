export type SettingValue = string | number | boolean | typeof Date
export type SettingRow = SettingValue[]

export class RawSetting {
	type: string
	settingRows: SettingRow[]
}

export interface IFileFormatter {
	toJSON(file: Buffer): Promise<RawSetting>
	toFile(setting: RawSetting): Promise<Buffer>
}
