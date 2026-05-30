const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'india_geo_api',
    password: '89191@Mani',
    port: 5432,
});

module.exports = pool;