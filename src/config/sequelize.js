require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'promptcraft_user',
        password: process.env.DB_PASSWORD || 'promptcraft_pass',
        database: process.env.DB_NAME || 'promptcraft_db',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: false,
    },
    test: {
        username: process.env.DB_USER || 'promptcraft_user',
        password: process.env.DB_PASSWORD || 'promptcraft_pass',
        database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : 'promptcraft_db_test',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 20,
            min: 5,
            acquire: 60000,
            idle: 10000,
        },
    },
};
