import { DataSource, DataSourceOptions } from 'typeorm'
import { CityRecord } from './entities/CityRecord.entity'
import { logger } from './logger'
export default class Database {
    datasource: DataSource
    debug: boolean
    constructor(opts: DataSourceOptions, debug = false) {
        this.debug = debug
        this.datasource = new DataSource(Object.assign(opts, { entities: [CityRecord] }))
        if (debug) logger.info('[database] Debug mode on')
    }
}
