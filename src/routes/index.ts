import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config/app';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    createChallengeSchema,
    updateChallengeSchema,
    evaluatePromptSchema,
    paginationSchema,
    challengeFilterSchema,
} from '../validators';
import * as authController from '../controllers/authController';
import * as challengeController from '../controllers/challengeController';
import * as evaluationController from '../controllers/evaluationController';
import * as leaderboardController from '../controllers/leaderboardController';
import * as userController from '../controllers/userController';

const router = Router();

// ============================================
// RATE LIMITERS
// ============================================

const generalLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

const evaluationLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.EVAL_RATE_LIMIT_MAX,
    message: 'Too many evaluation requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply general rate limiter to all routes
router.use(generalLimiter);

// ============================================
// AUTH ROUTES - /api/v1/auth
// ============================================

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/refresh', validate(refreshTokenSchema), authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.get('/me', authenticate, authController.getMe);

router.use('/auth', authRouter);

// ============================================
// CHALLENGE ROUTES - /api/v1/challenges
// ============================================

const challengeRouter = Router();

challengeRouter.get(
    '/',
    validate(challengeFilterSchema, 'query'),
    challengeController.getAllChallenges
);
challengeRouter.get('/:id', challengeController.getChallengeById);
challengeRouter.get('/:id/stats', challengeController.getChallengeStats);
challengeRouter.post(
    '/',
    authenticate,
    authorize('admin'),
    validate(createChallengeSchema),
    challengeController.createChallenge
);
challengeRouter.put(
    '/:id',
    authenticate,
    authorize('admin'),
    validate(updateChallengeSchema),
    challengeController.updateChallenge
);
challengeRouter.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    challengeController.deleteChallenge
);

router.use('/challenges', challengeRouter);

// ============================================
// EVALUATION ROUTES - /api/v1/evaluate
// ============================================

const evaluationRouter = Router();

evaluationRouter.post(
    '/',
    authenticate,
    evaluationLimiter,
    validate(evaluatePromptSchema),
    evaluationController.evaluatePrompt
);
evaluationRouter.get(
    '/my-attempts',
    authenticate,
    validate(paginationSchema, 'query'),
    evaluationController.getMyAttempts
);
evaluationRouter.get(
    '/my-attempts/:id',
    authenticate,
    evaluationController.getAttemptById
);

router.use('/evaluate', evaluationRouter);

// ============================================
// LEADERBOARD ROUTES - /api/v1/leaderboard
// ============================================

const leaderboardRouter = Router();

leaderboardRouter.get('/', leaderboardController.getGlobalLeaderboard);
leaderboardRouter.get('/my-rank', authenticate, leaderboardController.getMyRank);
leaderboardRouter.get(
    '/challenge/:challengeId',
    leaderboardController.getChallengeLeaderboard
);

router.use('/leaderboard', leaderboardRouter);

// ============================================
// USER MANAGEMENT ROUTES - /api/v1/users (Admin Only)
// ============================================

const userRouter = Router();

userRouter.get('/', authenticate, authorize('admin'), userController.getAllUsers);
userRouter.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

router.use('/users', userRouter);

export default router;
