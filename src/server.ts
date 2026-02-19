import http from 'http';
import app from './app';
import { config } from './config/app';
import { connectDatabase } from './config/database';
import logger from './utils/logger';
import './models';

const server = http.createServer(app);

async function startServer(): Promise<void> {
    try {
        await connectDatabase();

        server.listen(config.PORT, () => {
            logger.info(`🚀 Server running on port ${config.PORT}`);
            logger.info(`📝 Environment: ${config.NODE_ENV}`);
            logger.info(`🔗 API: http://localhost:${config.PORT}${config.API_PREFIX}`);
            logger.info(`💚 Health: http://localhost:${config.PORT}/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

function gracefulShutdown(signal: string): void {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();
