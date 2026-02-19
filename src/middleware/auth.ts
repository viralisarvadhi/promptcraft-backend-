import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { AuthenticatedRequest } from '../types';
import { UserRole } from '../types';

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.substring(7);

        try {
            const decoded = verifyAccessToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    } catch (error) {
        next(error);
    }
}

export function authorize(...allowedRoles: UserRole[]) {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): void => {
        try {
            if (!req.user) {
                throw new AppError('Authentication required', 401);
            }

            if (!allowedRoles.includes(req.user.role)) {
                throw new AppError('Insufficient permissions', 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
