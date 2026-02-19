import { z } from 'zod';

// ============================================
// AUTH VALIDATORS
// ============================================

export const registerSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email must not exceed 255 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================
// CHALLENGE VALIDATORS
// ============================================

export const createChallengeSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must not exceed 100 characters'),
    category: z.enum([
        'UI/UX Design',
        'Backend',
        'AI Prompting',
        'Database',
        'DevOps',
        'Data Science',
    ]),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    instruction: z.string()
        .min(20, 'Instruction must be at least 20 characters'),
    tips: z.array(z.string().min(1))
        .min(1, 'At least one tip is required')
        .max(10, 'Maximum 10 tips allowed'),
    examplePrompt: z.string()
        .min(20, 'Example prompt must be at least 20 characters'),
    tags: z.array(z.string().min(1))
        .min(1, 'At least one tag is required')
        .max(10, 'Maximum 10 tags allowed'),
    estimatedMinutes: z.number()
        .int('Estimated minutes must be an integer')
        .min(1, 'Estimated minutes must be at least 1')
        .max(180, 'Estimated minutes must not exceed 180'),
});

export const updateChallengeSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must not exceed 100 characters')
        .optional(),
    category: z.enum([
        'UI/UX Design',
        'Backend',
        'AI Prompting',
        'Database',
        'DevOps',
        'Data Science',
    ]).optional(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    instruction: z.string()
        .min(20, 'Instruction must be at least 20 characters')
        .optional(),
    tips: z.array(z.string().min(1))
        .min(1, 'At least one tip is required')
        .max(10, 'Maximum 10 tips allowed')
        .optional(),
    examplePrompt: z.string()
        .min(20, 'Example prompt must be at least 20 characters')
        .optional(),
    tags: z.array(z.string().min(1))
        .min(1, 'At least one tag is required')
        .max(10, 'Maximum 10 tags allowed')
        .optional(),
    estimatedMinutes: z.number()
        .int('Estimated minutes must be an integer')
        .min(1, 'Estimated minutes must be at least 1')
        .max(180, 'Estimated minutes must not exceed 180')
        .optional(),
    isActive: z.boolean().optional(),
});

// ============================================
// EVALUATION VALIDATORS
// ============================================

export const evaluatePromptSchema = z.object({
    challengeId: z.string().uuid('Invalid challenge ID'),
    promptText: z.string()
        .min(10, 'Prompt must be at least 10 characters')
        .max(5000, 'Prompt must not exceed 5000 characters'),
});

// ============================================
// QUERY VALIDATORS
// ============================================

export const paginationSchema = z.object({
    page: z.string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(z.number().int().positive()),
    limit: z.string()
        .optional()
        .default('10')
        .transform(Number)
        .pipe(z.number().int().positive().max(100)),
});

export const challengeFilterSchema = paginationSchema.extend({
    category: z.enum([
        'UI/UX Design',
        'Backend',
        'AI Prompting',
        'Database',
        'DevOps',
        'Data Science',
    ]).optional(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
});

// ============================================
// GEMINI RESPONSE VALIDATOR
// ============================================

export const geminiResponseSchema = z.object({
    dimensionScores: z.array(
        z.object({
            key: z.enum(['clarity', 'specificity', 'context', 'structure', 'completeness']),
            score: z.number().min(0).max(2),
            feedback: z.string(),
        })
    ).length(5),
    suggestions: z.array(z.string()).min(1).max(5),
    strengths: z.array(z.string()).max(3),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export type EvaluatePromptInput = z.infer<typeof evaluatePromptSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type ChallengeFilterQuery = z.infer<typeof challengeFilterSchema>;
export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
