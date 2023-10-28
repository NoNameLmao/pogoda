const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// this will run in node.js, not bun - need dotenv
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const geojsonFilePath = path.join(__dirname, './geo.json');
const geojsonData = JSON.parse(fs.readFileSync(geojsonFilePath, 'utf8'));

const cities = geojsonData.features.map((feature) => {
    const { name, population, coordinates } = feature.properties;
    const [longitude, latitude] = coordinates;
    return [name, population, latitude, longitude];
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS cities (
    name VARCHAR(255),
    population INT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
)`;

connection.query(createTableQuery, error => {
    if (error) throw error;
    
    const insertDataQuery = `INSERT INTO cities (name, population, latitude, longitude) VALUES ?`;
    connection.query(insertDataQuery, [cities], error => {
        if (error) throw error;
        
        console.log('Data inserted successfully');
        connection.end();
    });
});
