import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { sendError } from '../utils/response';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(
    err: Error | AppError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ZodError) {
        const errors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        logger.warn(`Validation error: ${errors}`);
        sendError(res, 'Validation failed', 400, errors);
        return;
    }

    if (err instanceof AppError) {
        logger.warn(`AppError: ${err.message}`, { statusCode: err.statusCode });
        sendError(res, err.message, err.statusCode);
        return;
    }

    logger.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    sendError(res, 'Internal server error', 500, err.message);
}

export function notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
    next(error);
}
