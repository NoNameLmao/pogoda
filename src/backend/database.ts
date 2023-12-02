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
    async init() {
        await this.datasource.initialize()
        logger.info('[database] Connected to database')
    }
    findCityByName(name: string) {
        return this.datasource.manager.findOne(CityRecord, { where: { name } })
    }
    async searchCities(searchQuery: string) {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        const cities = await cityRepository.createQueryBuilder('city')
            .where('city.name LIKE :name', { name: `%${searchQuery}%` })
            .getMany()
        return cities.map(city => city.name)
    }
    async addCity(name: string, country: string) {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        const city = new CityRecord()
        city.name = name
        city.country = country
        await cityRepository.save(city)
    }
    async removeCity(name: string) {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        const city = await cityRepository.findOne({ where: { name } })
        if (!city) return
        await cityRepository.remove(city)
    }
    async getCity(name: string) {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        return cityRepository.findOne({ where: { name } })
    }
    async getAllCities() {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        return cityRepository.find()
    }
    async getCityCount() {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        return cityRepository.count()
    }
    async getCityCountByCountry(country: string) {
        const cityRepository = this.datasource.manager.getRepository(CityRecord)
        return cityRepository.count({ where: { country } })
    }
}
