import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export function sendSuccess<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): Response {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };

    if (message) {
        response.message = message;
    }

    return res.status(statusCode).json(response);
}

export function sendCreated<T>(
    res: Response,
    data: T,
    message?: string
): Response {
    return sendSuccess(res, data, message, 201);
}

export function sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: string
): Response {
    const response: ApiResponse = {
        success: false,
        message,
    };

    if (error) {
        response.error = error;
    }

    return res.status(statusCode).json(response);
}

export function paginate<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
): Response {
    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMeta = {
        total,
        page,
        limit,
        totalPages,
    };

    const response: ApiResponse<T[]> = {
        success: true,
        data,
        meta,
    };

    if (message) {
        response.message = message;
    }

    return res.status(200).json(response);
}
