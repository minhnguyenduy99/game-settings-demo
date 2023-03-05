import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { SettingVersionOrmEntity } from './setting-version.entity'

@Entity({
	name: 'tag',
})
export class TagOrmEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToMany(
		() => SettingVersionOrmEntity,
		(settingVersion) => settingVersion.tags,
	)
	versions: SettingVersionOrmEntity[]
}
