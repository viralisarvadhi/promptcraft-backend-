import { Sequelize } from 'sequelize';
import { config } from './app';
import logger from '../utils/logger';

const sequelize = new Sequelize({
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    dialect: 'postgres',
    logging: config.NODE_ENV === 'development' ? (msg: string) => logger.debug(msg) : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true,
    },
});

export async function connectDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        logger.info('✅ Database connection established successfully');
    } catch (error) {
        logger.error('❌ Unable to connect to the database:', error);
        throw error;
    }
}

export default sequelize;
