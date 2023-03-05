// which npm package can be used to zip files?
import * as AdmZip from 'adm-zip'
import { Injectable } from '@nestjs/common'
import { SettingOfTagDTO, TagExportDTO } from '../dtos/settings-service.dtos'
import { SettingsService } from './settings.service'
import * as fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const rm = promisify(fs.rm)

@Injectable()
export class ExportService {
	constructor(private readonly settingService: SettingsService) {}

	// write a method to export settings by tag
	async exportSettingsByTag(tag: string): Promise<TagExportDTO> {
		const tagInfo = await this.settingService.getSettingsOfATag(tag)
		if (!tagInfo) {
			throw new Error('Tag not found')
		}
		// generate a folder name based on current time and replace all : and dot with -
		const folderName = new Date().toISOString().replace(/:|\./g, '-')
		const exportPath = `exports/${folderName}`
		const fileName = `setting_${tag}.zip`
		await mkdir(exportPath, { recursive: true })
		await Promise.all(
			tagInfo.settings.map((setting) =>
				this.exportSettingToExcel(setting, exportPath),
			),
		)

		const zip = new AdmZip()
		zip.addLocalFolder(exportPath)
		const buffer = await zip.toBufferPromise()
		await rm(`${exportPath}`, { recursive: true, force: true })

		return {
			file: buffer,
			name: fileName,
		}
	}

	private async exportSettingToExcel(
		setting: SettingOfTagDTO,
		exportPath: string,
	) {
		const formatter = SettingsService.FORMATTERS[setting.type]
		const buffer = await formatter.toFile(setting.value)
		await writeFile(`${exportPath}/${setting.name}.xlsx`, buffer)
	}
}
