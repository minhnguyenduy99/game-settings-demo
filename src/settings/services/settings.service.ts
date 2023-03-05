import { Injectable } from '@nestjs/common'
import { DataSource, In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
	AddSettingsDTO,
	SettingsDTO,
	TagDTO,
	TagSettingVersionDTO,
	UpdateSettingsDTO,
} from '../dtos/settings-service.dtos'
import {
	ReadonlySettingOrmEntity,
	SettingOrmEntity,
	SettingVersionOrmEntity,
	TagOrmEntity,
} from '../models'
import { BaseFormatter, KeyValueFormatter, ListFormatter } from './formatters'

@Injectable()
export class SettingsService {
	static FORMATTERS = {
		key_value: new KeyValueFormatter(),
		list: new ListFormatter(),
	}

	constructor(
		@InjectRepository(SettingOrmEntity)
		private readonly settingRepo: Repository<SettingOrmEntity>,
		@InjectRepository(ReadonlySettingOrmEntity)
		private readonly readonlySettingRepo: Repository<ReadonlySettingOrmEntity>,
		@InjectRepository(SettingVersionOrmEntity)
		private readonly settingVersionRepo: Repository<SettingVersionOrmEntity>,
		@InjectRepository(TagOrmEntity)
		private readonly tagRepo: Repository<TagOrmEntity>,
		private readonly dataSource: DataSource,
	) {}

	async uploadSetting(dto: AddSettingsDTO) {
		const { name, type, file } = dto
		const formatter = this.getSetting(type)
		if (!formatter) {
			throw new Error('Invalid setting type')
		}
		const settingData = await formatter.format(file.buffer)
		const existingSetting = await this.settingRepo.findOne({
			relations: ['currentVersion'],
			where: {
				name,
			},
		})
		if (existingSetting) {
			const newCurrentVersion = new SettingVersionOrmEntity()
			newCurrentVersion.tags = []
			newCurrentVersion.value = settingData
			newCurrentVersion.version =
				existingSetting.currentVersion.version + 1
			newCurrentVersion.settingId = existingSetting.id
			existingSetting.currentVersion = newCurrentVersion
			await this.dataSource.transaction(async (manager) => {
				const settingRepo = manager.getRepository(SettingOrmEntity)
				await settingRepo.save(existingSetting)
			})
			return
		}

		const setting = new SettingOrmEntity()
		setting.name = name
		setting.type = type

		await this.dataSource.transaction(async (manager) => {
			const settingRepo = manager.getRepository(SettingOrmEntity)
			const result = await settingRepo.insert(setting)
			setting.id = result.raw.insertId
			// save setting version
			const settingVersion = new SettingVersionOrmEntity()
			settingVersion.version = 1
			settingVersion.value = settingData
			settingVersion.tags = []
			settingVersion.settingId = setting.id

			setting.currentVersion = settingVersion

			await settingRepo.save(setting)
		})
	}

	async tagSettingVersion(dto: TagSettingVersionDTO) {
		const { name, versionIds } = dto
		let tag
		if (versionIds === 'all') {
			const allSettings = await this.readonlySettingRepo.find({
				relations: {
					currentVersion: true,
					versions: false,
				},
			})
			const versions = allSettings.map(
				(setting) => setting.currentVersion,
			)
			tag = {
				name,
				versions,
			}
		} else {
			const versions = await this.settingVersionRepo.find({
				where: {
					id: In(versionIds),
				},
			})
			tag = {
				name,
				versions,
			}
		}

		await this.tagRepo.save(tag)
	}

	// create a method to query all settings in the repository
	async getAllSettings(): Promise<SettingsDTO[]> {
		const settings = await this.readonlySettingRepo.find({
			relations: [
				'currentVersion',
				'versions',
				'versions.tags',
				'currentVersion.tags',
			],
		})
		return settings.map((setting) => ({
			id: setting.id,
			name: setting.name,
			type: setting.type,
			currentVersion: {
				id: setting.currentVersion.id,
				version: setting.currentVersion.version,
				value: setting.currentVersion.value,
				tags: setting.currentVersion.tags.map((tag) => tag.name),
			},
			versions: setting.versions.map((version) => ({
				id: version.id,
				version: version.version,
				value: version.value,
				tags: version.tags.map((tag) => tag.name),
			})),
		}))
	}

	// write a method to get all settings by tag
	async getSettingsOfATag(tagName: string): Promise<TagDTO> {
		const tag = await this.tagRepo.findOne({
			where: {
				name: tagName,
			},
			relations: ['versions', 'versions.setting'],
		})
		if (!tag) {
			return null
		}
		return {
			id: tag.id,
			name: tag.name,
			settings: tag.versions.map((version) => ({
				id: version.setting.id,
				name: version.setting.name,
				type: version.setting.type,
				value: version.value,
				version: version.version,
			})),
		}
	}

	// write a method to get all tags
	async getAllTags(): Promise<string[]> {
		const tags = await this.tagRepo.find()
		return tags.map((tag) => tag.name)
	}

	private getSetting(type: string): BaseFormatter {
		return SettingsService.FORMATTERS[type]
	}
}
