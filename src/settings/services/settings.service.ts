import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager, In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
	AddSettingsDTO,
	SettingsDTO,
	TagDTO,
	TagSettingVersionDTO,
	UpdateSettingsDTO,
	UploadSettingByTagDTO,
} from '../dtos/settings-service.dtos'
import {
	ReadonlySettingOrmEntity,
	SettingOrmEntity,
	SettingVersionOrmEntity,
	TagOrmEntity,
} from '../models'
import { GameSetting, GameSettingService } from '../domain'

@Injectable()
export class SettingsService {
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
		private readonly gameSettingService: GameSettingService,
	) {}

	async convertSettingToExcel(setting: GameSetting) {
		return this.gameSettingService.convertToExcel(setting)
	}

	async uploadSetting(dto: AddSettingsDTO) {
		const { name, file } = dto
		const gameSetting = await this.gameSettingService.formatFromExcel(file)
		if (!gameSetting) {
			throw new Error('Invalid setting file')
		}
		const existingSetting = await this.settingRepo.findOne({
			relations: ['currentVersion'],
			where: {
				name,
			},
		})
		if (existingSetting) {
			if (existingSetting.type !== gameSetting.type) {
				throw new Error(
					'Setting type mismatched. Type must be ' +
						existingSetting.type,
				)
			}
			const newCurrentVersion = new SettingVersionOrmEntity()
			newCurrentVersion.tags = []
			newCurrentVersion.value = gameSetting.settings
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
		setting.type = gameSetting.type

		await this.dataSource.transaction(async (manager) => {
			const settingRepo = manager.getRepository(SettingOrmEntity)
			const result = await settingRepo.insert(setting)
			setting.id = result.raw.insertId
			// save setting version
			const settingVersion = new SettingVersionOrmEntity()
			settingVersion.version = 1
			settingVersion.value = gameSetting.settings
			settingVersion.tags = []
			settingVersion.settingId = setting.id

			setting.currentVersion = settingVersion

			await settingRepo.save(setting)
		})
	}

	async uploadSettingsByTag(dto: UploadSettingByTagDTO) {
		const { tag, settings } = dto
		await Promise.all(
			settings.map((setting) => this.uploadSetting(setting)),
		)
		await this.tagSettingVersion({
			name: tag,
			versionIds: 'all',
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
}
