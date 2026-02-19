import { User } from '../models';
import { AppError } from '../middleware/errorHandler';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { CreateUserInput, LoginInput, UserPublic, TokenPair, JwtPayload } from '../types';

export async function registerUser(input: CreateUserInput): Promise<{ user: UserPublic; tokens: TokenPair }> {
    const existingUser = await (User as any).findOne({
        where: { email: input.email },
    });

    if (existingUser) {
        throw new AppError('Email already registered', 409);
    }

    const existingUsername = await (User as any).findOne({
        where: { username: input.username },
    });

    if (existingUsername) {
        throw new AppError('Username already taken', 409);
    }

    const user = await (User as any).create({
        username: input.username,
        email: input.email,
        passwordHash: input.password,
        role: 'user',
    });

    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const tokens = generateTokenPair(payload);

    return {
        user: user.toPublic(),
        tokens,
    };
}

export async function loginUser(input: LoginInput): Promise<{ user: UserPublic; tokens: TokenPair }> {
    const user = await (User as any).findOne({
        where: { email: input.email },
    });

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(input.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const tokens = generateTokenPair(payload);

    return {
        user: user.toPublic(),
        tokens,
    };
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    try {
        const decoded = verifyRefreshToken(refreshToken);

        const user = await (User as any).findByPk(decoded.userId);

        if (!user) {
            throw new AppError('User not found', 401);
        }

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        return generateTokenPair(payload);
    } catch (error) {
        throw new AppError('Invalid or expired refresh token', 401);
    }
}

export async function getUserById(userId: string): Promise<UserPublic> {
    const user = await (User as any).findByPk(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user.toPublic();
}
