export class AddSettingsDTO {
	name: string
	type: string
	file?: Express.Multer.File
}

export class UpdateSettingsDTO {
	name: string
	file: Express.Multer.File
}

export class TagSettingVersionDTO {
	name: string
	versionIds: number[] | 'all'
}

export class SettingVersionDTO {
	id: number
	version: number
	value: object
	tags: string[]
}

export class SettingsDTO {
	id: number
	name: string
	type: string
	currentVersion: SettingVersionDTO
	versions: SettingVersionDTO[]
}
