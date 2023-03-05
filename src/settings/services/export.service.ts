import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
	SettingOrmEntity,
	SettingVersionOrmEntity,
	TagOrmEntity,
} from '../models'

@Injectable()
export class ExportService {
	constructor(
		@InjectRepository(SettingOrmEntity)
		private readonly settingRepo: Repository<SettingOrmEntity>,
		@InjectRepository(SettingVersionOrmEntity)
		private readonly settingVersionRepo: Repository<SettingVersionOrmEntity>,
		@InjectRepository(TagOrmEntity)
		private readonly tagRepo: Repository<TagOrmEntity>,
	) {}
}
