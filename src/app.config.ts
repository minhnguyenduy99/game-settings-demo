import { DataSourceOptions } from 'typeorm'
import { DATABASE_CONFIG } from './app.constants'

export default () => ({
	[DATABASE_CONFIG]: {
		type: 'mysql',
		url: process.env.DATABASE_CONNECTION_STRING,
		autoLoadEntities: true,
		synchronize: false,
		logging: true,
		entityPrefix: '', // put your table's name prefix here,
	} as DataSourceOptions,
})
