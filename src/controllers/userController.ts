import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { sendSuccess } from '../utils/response';

export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users = await userService.getAllUsers();
        sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
        next(error);
    }
}
