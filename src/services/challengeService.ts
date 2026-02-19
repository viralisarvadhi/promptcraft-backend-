import { Op } from 'sequelize';
import { Challenge, Attempt } from '../models';
import { AppError } from '../middleware/errorHandler';
import {
    ChallengeAttributes,
    CreateChallengeInput,
    UpdateChallengeInput,
    ChallengeFilters,
    PaginationQuery,
    ChallengeStats,
    GradeDistribution,
} from '../types';

export async function getAllChallenges(
    filters: ChallengeFilters,
    pagination: PaginationQuery
): Promise<{ challenges: ChallengeAttributes[]; total: number }> {
    const where: Record<string, unknown> = { isActive: true };

    if (filters.category) {
        where.category = filters.category;
    }

    if (filters.difficulty) {
        where.difficulty = filters.difficulty;
    }

    const offset = (pagination.page - 1) * pagination.limit;

    const { count, rows } = await Challenge.findAndCountAll({
        where,
        limit: pagination.limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        challenges: rows.map(c => c.toJSON() as ChallengeAttributes),
        total: count,
    };
}

export async function getChallengeById(id: string): Promise<ChallengeAttributes> {
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
        throw new AppError('Challenge not found', 404);
    }

    return challenge.toJSON() as ChallengeAttributes;
}

export async function getChallengeStats(id: string): Promise<ChallengeStats> {
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
        throw new AppError('Challenge not found', 404);
    }

    const attempts = await Attempt.findAll({
        where: { challengeId: id },
    });

    const totalAttempts = attempts.length;

    if (totalAttempts === 0) {
        return {
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            gradeDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 },
        };
    }

    const totalScore = attempts.reduce((sum, a) => sum + a.totalScore, 0);
    const averageScore = parseFloat((totalScore / totalAttempts).toFixed(2));
    const bestScore = Math.max(...attempts.map(a => a.totalScore));

    const gradeDistribution: GradeDistribution = { S: 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    attempts.forEach(a => {
        gradeDistribution[a.grade]++;
    });

    return {
        totalAttempts,
        averageScore,
        bestScore,
        gradeDistribution,
    };
}

export async function createChallenge(input: CreateChallengeInput): Promise<ChallengeAttributes> {
    const challenge = await Challenge.create({
        title: input.title,
        category: input.category,
        difficulty: input.difficulty,
        instruction: input.instruction,
        tips: input.tips,
        examplePrompt: input.examplePrompt,
        tags: input.tags,
        estimatedMinutes: input.estimatedMinutes,
        isActive: true,
    });

    return challenge.toJSON() as ChallengeAttributes;
}

export async function updateChallenge(
    id: string,
    input: UpdateChallengeInput
): Promise<ChallengeAttributes> {
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
        throw new AppError('Challenge not found', 404);
    }

    await challenge.update(input);

    return challenge.toJSON() as ChallengeAttributes;
}

export async function deleteChallenge(id: string): Promise<void> {
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
        throw new AppError('Challenge not found', 404);
    }

    await challenge.destroy();
}
