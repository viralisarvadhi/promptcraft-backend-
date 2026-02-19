import { Op } from 'sequelize';
import { User, Attempt } from '../models';
import { AppError } from '../middleware/errorHandler';
import { LeaderboardEntry, ChallengeLeaderboardEntry, UserRank, AttemptAttributes } from '../types';

export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await (User as any).findAll({
        where: {
            totalAttempts: { [Op.gt]: 0 },
        },
        order: [
            ['bestScore', 'DESC'],
            ['totalAttempts', 'DESC'],
        ],
        limit: 20,
    });

    return users.map((user: any, index: number): LeaderboardEntry => ({
        id: user.id,
        username: user.username,
        bestScore: user.bestScore,
        totalAttempts: user.totalAttempts,
        averageScore: user.averageScore,
        rank: index + 1,
    }));
}

export async function getMyRank(userId: string): Promise<UserRank> {
    const user = await (User as any).findByPk(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const totalUsers = await (User as any).count({
        where: {
            totalAttempts: { [Op.gt]: 0 },
        },
    });

    const usersAbove = await (User as any).count({
        where: {
            totalAttempts: { [Op.gt]: 0 },
            [Op.or]: [
                { bestScore: { [Op.gt]: user.bestScore } },
                {
                    bestScore: user.bestScore,
                    totalAttempts: { [Op.gt]: user.totalAttempts },
                },
            ],
        },
    });

    const rank = usersAbove + 1;

    return {
        rank,
        total: totalUsers,
    };
}

export async function getChallengeLeaderboard(
    challengeId: string
): Promise<ChallengeLeaderboardEntry[]> {
    const attempts = await (Attempt as any).findAll({
        where: { challengeId },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username'],
            },
        ],
        order: [
            ['totalScore', 'DESC'],
            ['createdAt', 'ASC'],
        ],
        limit: 20,
    });

    const seen = new Set<string>();
    const uniqueAttempts: ChallengeLeaderboardEntry[] = [];

    attempts.forEach((attempt: any) => {
        const attemptData = attempt.toJSON() as AttemptAttributes & { user: { id: string; username: string } };

        if (!seen.has(attemptData.userId)) {
            seen.add(attemptData.userId);
            uniqueAttempts.push({
                id: attemptData.user.id,
                username: attemptData.user.username,
                totalScore: attemptData.totalScore,
                grade: attemptData.grade,
                createdAt: attemptData.createdAt,
                rank: uniqueAttempts.length + 1,
            });
        }
    });

    return uniqueAttempts;
}
