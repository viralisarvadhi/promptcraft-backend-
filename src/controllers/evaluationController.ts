import { Request, Response, NextFunction } from 'express';
import * as evaluationService from '../services/evaluationService';
import { sendSuccess, paginate } from '../utils/response';
import { EvaluatePromptInput, PaginationQuery } from '../validators';
import { AuthenticatedRequest } from '../types';

export async function evaluatePrompt(
    req: AuthenticatedRequest<object, object, EvaluatePromptInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const { attemptId, result } = await evaluationService.evaluatePrompt(
            req.user.userId,
            req.body
        );

        sendSuccess(res, { attemptId, result }, 'Prompt evaluated successfully');
    } catch (error) {
        next(error);
    }
}

export async function getMyAttempts(
    req: AuthenticatedRequest<object, object, object, PaginationQuery>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const { page, limit } = req.query;
        const pagination = { page, limit };

        const { attempts, total } = await evaluationService.getMyAttempts(
            req.user.userId,
            pagination
        );

        paginate(res, attempts, total, page, limit);
    } catch (error) {
        next(error);
    }
}

export async function getAttemptById(
    req: AuthenticatedRequest<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const attempt = await evaluationService.getAttemptById(
            req.user.userId,
            req.params.id
        );

        sendSuccess(res, attempt);
    } catch (error) {
        next(error);
    }
}
