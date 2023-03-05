import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { SettingVersionOrmEntity } from './setting-version.entity'

@Entity({
	name: 'setting',
})
export class SettingOrmEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@OneToOne(() => SettingVersionOrmEntity, {
		cascade: true,
	})
	@JoinColumn({
		name: 'current_version_id',
	})
	currentVersion: SettingVersionOrmEntity

	@OneToMany(
		() => SettingVersionOrmEntity,
		(settingVersion) => settingVersion.setting,
		{
			eager: false,
		},
	)
	versions?: SettingVersionOrmEntity[]

	@Column()
	type: string
}

@Entity({
	name: 'setting',
})
export class ReadonlySettingOrmEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	type: string

	@OneToMany(
		() => SettingVersionOrmEntity,
		(settingVersion) => settingVersion.setting,
	)
	versions?: SettingVersionOrmEntity[]

	@OneToOne(() => SettingVersionOrmEntity)
	@JoinColumn({
		name: 'current_version_id',
		referencedColumnName: 'id',
	})
	currentVersion?: SettingVersionOrmEntity
}
