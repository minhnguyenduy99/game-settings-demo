export class AddSettingsDTO {
	name: string
	file: Buffer
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

export class TagDTO {
	id: number
	name: string
	settings: SettingOfTagDTO[]
}

export class SettingOfTagDTO {
	id: number
	name: string
	type: string
	version: number
	value: object
}

export class TagExportDTO {
	file: Buffer
	name: string
}
