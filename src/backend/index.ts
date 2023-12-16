import express from 'express';
import Database from './database';
import { CityRecord } from './entities/CityRecord.entity';
import { OpenMeteo } from './openmeteo'

const app = express();
const port = 3000;

const openmeteo = new OpenMeteo()
const database = new Database({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    synchronize: process.env.MYSQL_SYNC === 'true',
    logging: true,
    entities: [CityRecord]
})

async function main() {
    await database.init()
    app.get('/', (_, res) => {
        res.send('Hello World!');
    });
    app.get('/cityautocomplete', async (req, res) => {
        const { query } = req.query
        if (typeof query !== 'string') return
        const results = await database.searchCities(query)
        res.json(results)
    })
    app.get('/currentweather', async (req, res) => {
        const { query } = req.query
        if (typeof query !== 'string') {
            res.status(400).json({ message: 'Bad request, invalid query. Неверный запрос.' })
            return
        }
        const city = await database.getCity(query)
        if (!city) {
            res.status(404).json({ message: 'City not found. Город не найден.' })
            return
        }
        const currentWeather = await openmeteo.current(city.lat, city.lng)
        res.json(currentWeather)
    })
    
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main()
