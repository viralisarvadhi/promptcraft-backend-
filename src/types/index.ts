import { Request } from 'express';

// ============================================
// ENUMS
// ============================================

export type UserRole = 'user' | 'admin';

export type ChallengeCategory =
    | 'UI/UX Design'
    | 'Backend'
    | 'AI Prompting'
    | 'Database'
    | 'DevOps'
    | 'Data Science';

export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export type EvaluatorType = 'ai' | 'heuristic';

export type RubricKey = 'clarity' | 'specificity' | 'context' | 'structure' | 'completeness';

// ============================================
// MODEL ATTRIBUTES
// ============================================

export interface UserAttributes {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface UserPublic {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChallengeAttributes {
    id: string;
    title: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    instruction: string;
    tips: string[];
    examplePrompt: string;
    tags: string[];
    estimatedMinutes: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface AttemptAttributes {
    id: string;
    userId: string;
    challengeId: string;
    promptText: string;
    totalScore: number;
    grade: Grade;
    clarityScore: number;
    specificityScore: number;
    contextScore: number;
    structureScore: number;
    completenessScore: number;
    suggestions: string[];
    strengths: string[];
    evaluatorType: EvaluatorType;
    wordCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// ============================================
// EVALUATION TYPES
// ============================================

export interface DimensionScore {
    key: RubricKey;
    score: number;
    feedback: string;
}

export interface EvaluationResult {
    totalScore: number;
    grade: Grade;
    clarityScore: number;
    specificityScore: number;
    contextScore: number;
    structureScore: number;
    completenessScore: number;
    suggestions: string[];
    strengths: string[];
    evaluatorType: EvaluatorType;
    wordCount: number;
}

export interface GeminiResponse {
    dimensionScores: DimensionScore[];
    suggestions: string[];
    strengths: string[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: PaginationMeta;
    error?: string;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginationQuery {
    page: number;
    limit: number;
}

// ============================================
// JWT TYPES
// ============================================

export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

// ============================================
// REQUEST TYPES
// ============================================

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

// ============================================
// LEADERBOARD TYPES
// ============================================

export interface LeaderboardEntry {
    id: string;
    username: string;
    bestScore: number;
    totalAttempts: number;
    averageScore: number;
    rank: number;
}

export interface ChallengeLeaderboardEntry {
    id: string;
    username: string;
    totalScore: number;
    grade: Grade;
    createdAt: Date;
    rank: number;
}

export interface UserRank {
    rank: number;
    total: number;
}

// ============================================
// CHALLENGE STATS TYPES
// ============================================

export interface ChallengeStats {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    gradeDistribution: GradeDistribution;
}

export interface GradeDistribution {
    S: number;
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
}

// ============================================
// SERVICE INPUT TYPES
// ============================================

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface CreateChallengeInput {
    title: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    instruction: string;
    tips: string[];
    examplePrompt: string;
    tags: string[];
    estimatedMinutes: number;
}

export interface UpdateChallengeInput {
    title?: string;
    category?: ChallengeCategory;
    difficulty?: ChallengeDifficulty;
    instruction?: string;
    tips?: string[];
    examplePrompt?: string;
    tags?: string[];
    estimatedMinutes?: number;
    isActive?: boolean;
}

export interface EvaluatePromptInput {
    challengeId: string;
    promptText: string;
}

export interface ChallengeFilters {
    category?: ChallengeCategory;
    difficulty?: ChallengeDifficulty;
    isActive?: boolean;
}
