import winston from 'winston';
import { config } from '../config/app';

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
};

winston.addColors(logColors);

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaString = '';
        if (Object.keys(meta).length > 0) {
            metaString = `\n${JSON.stringify(meta, null, 2)}`;
        }
        return `${timestamp} [${level}]: ${message}${metaString}`;
    })
);

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: consoleFormat,
    }),
];

if (config.NODE_ENV === 'production') {
    transports.push(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: logFormat,
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: logFormat,
        })
    );
}

const logger = winston.createLogger({
    levels: logLevels,
    level: config.LOG_LEVEL,
    format: logFormat,
    transports,
    exitOnError: false,
});

export default logger;
