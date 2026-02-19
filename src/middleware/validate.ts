import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(
    schema: ZodSchema,
    target: ValidationTarget = 'body'
) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dataToValidate = req[target];
            const validated = await schema.parseAsync(dataToValidate);
            req[target] = validated;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors
                    .map(e => `${e.path.join('.')}: ${e.message}`)
                    .join(', ');
                sendError(res, 'Validation failed', 400, errors);
                return;
            }
            next(error);
        }
    };
}
