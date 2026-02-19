import { Request, Response, NextFunction } from 'express';
import * as leaderboardService from '../services/leaderboardService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function getGlobalLeaderboard(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const leaderboard = await leaderboardService.getGlobalLeaderboard();

        sendSuccess(res, leaderboard);
    } catch (error) {
        next(error);
    }
}

export async function getMyRank(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const rank = await leaderboardService.getMyRank(req.user.userId);

        sendSuccess(res, rank);
    } catch (error) {
        next(error);
    }
}

export async function getChallengeLeaderboard(
    req: Request<{ challengeId: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const leaderboard = await leaderboardService.getChallengeLeaderboard(
            req.params.challengeId
        );

        sendSuccess(res, leaderboard);
    } catch (error) {
        next(error);
    }
}
