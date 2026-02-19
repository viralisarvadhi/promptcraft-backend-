import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess, sendCreated } from '../utils/response';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../validators';
import { AuthenticatedRequest } from '../types';

export async function register(
    req: Request<object, object, RegisterInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { user, tokens } = await authService.registerUser(req.body);

        sendCreated(res, { user, ...tokens }, 'User registered successfully');
    } catch (error) {
        next(error);
    }
}

export async function login(
    req: Request<object, object, LoginInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { user, tokens } = await authService.loginUser(req.body);

        sendSuccess(res, { user, ...tokens }, 'Login successful');
    } catch (error) {
        next(error);
    }
}

export async function refresh(
    req: Request<object, object, RefreshTokenInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokens = await authService.refreshAccessToken(req.body.refreshToken);

        sendSuccess(res, tokens, 'Tokens refreshed successfully');
    } catch (error) {
        next(error);
    }
}

export async function logout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
}

export async function getMe(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const user = await authService.getUserById(req.user.userId);

        sendSuccess(res, user);
    } catch (error) {
        next(error);
    }
}
