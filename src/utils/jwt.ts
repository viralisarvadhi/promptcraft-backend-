import jwt from 'jsonwebtoken';
import { config } from '../config/app';
import { JwtPayload, TokenPair } from '../types';

export function signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
}

export function signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
}

export function verifyAccessToken(token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
}

export function verifyRefreshToken(token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
}

export function generateTokenPair(payload: JwtPayload): TokenPair {
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
}
