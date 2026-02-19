import { Challenge, Attempt, User } from '../models';
import { AppError } from '../middleware/errorHandler';
import { heuristicEvaluate, countWords, getGrade } from '../utils/evaluator';
import { config } from '../config/app';
import logger from '../utils/logger';
import { geminiResponseSchema } from '../validators';
import {
    EvaluatePromptInput,
    EvaluationResult,
    AttemptAttributes,
    PaginationQuery,
    DimensionScore,
} from '../types';

async function callGeminiAPI(
    promptText: string,
    challengeInstruction: string,
    tips: string[]
): Promise<EvaluationResult | null> {
    if (!config.ENABLE_AI_EVALUATION || !config.GEMINI_API_KEY) {
        logger.info('AI evaluation disabled or no API key, using heuristic fallback');
        return null;
    }

    try {
        const tipsFormatted = tips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n');

        const evaluationPrompt = `You are an expert prompt engineering evaluator. Score the prompt on 5 dimensions (0-2 each, decimals allowed). Respond ONLY with valid JSON. No markdown. No extra text.

Task the user was given:
${challengeInstruction}

Hints to cover:
${tipsFormatted}

User's submitted prompt:
"""
${promptText}
"""

Return ONLY this JSON:
{
  "dimensionScores": [
    { "key": "clarity", "score": 0-2, "feedback": "one sentence" },
    { "key": "specificity", "score": 0-2, "feedback": "one sentence" },
    { "key": "context", "score": 0-2, "feedback": "one sentence" },
    { "key": "structure", "score": 0-2, "feedback": "one sentence" },
    { "key": "completeness", "score": 0-2, "feedback": "one sentence" }
  ],
  "suggestions": ["actionable improvement tip"],
  "strengths": ["what they did well"]
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: evaluationPrompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!response.ok) {
            logger.warn(`Gemini API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

        if (!rawText) {
            logger.warn('Gemini API returned empty response');
            return null;
        }

        const cleanText = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanText);

        const validated = geminiResponseSchema.parse(parsed);

        const dimensionScoresMap: Record<string, DimensionScore> = {};
        validated.dimensionScores.forEach(ds => {
            dimensionScoresMap[ds.key] = ds;
        });

        const clarityScore = dimensionScoresMap.clarity?.score ?? 0;
        const specificityScore = dimensionScoresMap.specificity?.score ?? 0;
        const contextScore = dimensionScoresMap.context?.score ?? 0;
        const structureScore = dimensionScoresMap.structure?.score ?? 0;
        const completenessScore = dimensionScoresMap.completeness?.score ?? 0;

        const totalScore = parseFloat(
            (clarityScore + specificityScore + contextScore + structureScore + completenessScore).toFixed(2)
        );

        const grade = getGrade(totalScore);
        const wordCount = countWords(promptText);

        logger.info('Gemini API evaluation successful');

        return {
            totalScore,
            grade,
            clarityScore,
            specificityScore,
            contextScore,
            structureScore,
            completenessScore,
            suggestions: validated.suggestions,
            strengths: validated.strengths,
            evaluatorType: 'ai',
            wordCount,
        };
    } catch (error) {
        logger.warn('Gemini API call failed, falling back to heuristic', { error });
        return null;
    }
}

export async function evaluatePrompt(
    userId: string,
    input: EvaluatePromptInput
): Promise<{ attemptId: string; result: EvaluationResult }> {
    const challenge = await Challenge.findByPk(input.challengeId);

    if (!challenge) {
        throw new AppError('Challenge not found', 404);
    }

    let result: EvaluationResult | null = await callGeminiAPI(
        input.promptText,
        challenge.instruction,
        challenge.tips
    );

    if (!result) {
        logger.info('Using heuristic evaluator');
        result = heuristicEvaluate(input.promptText, challenge.toJSON());
    }

    const attempt = await Attempt.create({
        userId,
        challengeId: input.challengeId,
        promptText: input.promptText,
        totalScore: result.totalScore,
        grade: result.grade,
        clarityScore: result.clarityScore,
        specificityScore: result.specificityScore,
        contextScore: result.contextScore,
        structureScore: result.structureScore,
        completenessScore: result.completenessScore,
        suggestions: result.suggestions,
        strengths: result.strengths,
        evaluatorType: result.evaluatorType,
        wordCount: result.wordCount,
    });

    const user = await User.findByPk(userId);

    if (user) {
        const newTotalAttempts = user.totalAttempts + 1;
        const newBestScore = Math.max(user.bestScore, result.totalScore);
        const newAverageScore = parseFloat(
            ((user.averageScore * user.totalAttempts + result.totalScore) / newTotalAttempts).toFixed(2)
        );

        await user.update({
            totalAttempts: newTotalAttempts,
            bestScore: newBestScore,
            averageScore: newAverageScore,
        });
    }

    return {
        attemptId: attempt.id,
        result,
    };
}

export async function getMyAttempts(
    userId: string,
    pagination: PaginationQuery
): Promise<{ attempts: AttemptAttributes[]; total: number }> {
    const offset = (pagination.page - 1) * pagination.limit;

    const { count, rows } = await Attempt.findAndCountAll({
        where: { userId },
        limit: pagination.limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        attempts: rows.map(a => a.toJSON() as AttemptAttributes),
        total: count,
    };
}

export async function getAttemptById(
    userId: string,
    attemptId: string
): Promise<AttemptAttributes> {
    const attempt = await Attempt.findOne({
        where: { id: attemptId, userId },
    });

    if (!attempt) {
        throw new AppError('Attempt not found', 404);
    }

    return attempt.toJSON() as AttemptAttributes;
}
