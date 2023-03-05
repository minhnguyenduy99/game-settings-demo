import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { ReadonlySettingOrmEntity, SettingOrmEntity } from './setting.entity'
import { TagOrmEntity } from './tag.entity'

@Entity({
	name: 'setting_version',
})
export class SettingVersionOrmEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => ReadonlySettingOrmEntity, (setting) => setting.versions)
	@JoinColumn({
		name: 'setting_id',
	})
	setting?: SettingOrmEntity

	@Column({
		name: 'setting_id',
		type: 'int',
	})
	settingId?: number

	@Column({
		name: 'version',
	})
	version: number

	@Column({
		type: 'json',
	})
	value: object

	@ManyToMany(() => TagOrmEntity, (tag) => tag.versions)
	@JoinTable({
		name: 'setting_version_tags_tag',
		inverseJoinColumn: {
			name: 'tag_id',
			referencedColumnName: 'id',
		},
		joinColumn: {
			name: 'version_id',
			referencedColumnName: 'id',
		},
	})
	tags?: TagOrmEntity[]
}
