import { Request, Response, NextFunction } from 'express';
import * as challengeService from '../services/challengeService';
import { sendSuccess, sendCreated, paginate } from '../utils/response';
import {
    CreateChallengeInput,
    UpdateChallengeInput,
    ChallengeFilterQuery,
} from '../validators';

export async function getAllChallenges(
    req: Request<object, object, object, ChallengeFilterQuery>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { page, limit, category, difficulty } = req.query;

        const filters = { category, difficulty };
        const pagination = { page, limit };

        const { challenges, total } = await challengeService.getAllChallenges(
            filters,
            pagination
        );

        paginate(res, challenges, total, page, limit);
    } catch (error) {
        next(error);
    }
}

export async function getChallengeById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const challenge = await challengeService.getChallengeById(req.params.id);

        sendSuccess(res, challenge);
    } catch (error) {
        next(error);
    }
}

export async function getChallengeStats(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const stats = await challengeService.getChallengeStats(req.params.id);

        sendSuccess(res, stats);
    } catch (error) {
        next(error);
    }
}

export async function createChallenge(
    req: Request<object, object, CreateChallengeInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const challenge = await challengeService.createChallenge(req.body);

        sendCreated(res, challenge, 'Challenge created successfully');
    } catch (error) {
        next(error);
    }
}

export async function updateChallenge(
    req: Request<{ id: string }, object, UpdateChallengeInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const challenge = await challengeService.updateChallenge(
            req.params.id,
            req.body
        );

        sendSuccess(res, challenge, 'Challenge updated successfully');
    } catch (error) {
        next(error);
    }
}

export async function deleteChallenge(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await challengeService.deleteChallenge(req.params.id);

        sendSuccess(res, null, 'Challenge deleted successfully');
    } catch (error) {
        next(error);
    }
}
