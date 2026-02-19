import express, { Request, Response, Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/app';
import logger from './utils/logger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { sendSuccess } from './utils/response';

const app: Application = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet());

app.use(
    cors({
        origin: config.CORS_ORIGIN,
        credentials: true,
    })
);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// COMPRESSION MIDDLEWARE
// ============================================

app.use(compression());

// ============================================
// LOGGING MIDDLEWARE
// ============================================

if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(
        morgan('combined', {
            stream: {
                write: (message: string) => logger.info(message.trim()),
            },
        })
    );
}

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (req: Request, res: Response) => {
    sendSuccess(res, {
        status: 'ok',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ============================================
// API ROUTES
// ============================================

app.use(config.API_PREFIX, routes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
