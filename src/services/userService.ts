import { User } from '../models';
import { AppError } from '../middleware/errorHandler';
import { UserPublic } from '../types';

export async function getAllUsers(): Promise<UserPublic[]> {
    const users = await User.findAll({
        order: [['createdAt', 'DESC']],
    });

    return users.map(user => user.toPublic());
}

export async function deleteUser(id: string): Promise<void> {
    const user = await User.findByPk(id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
        throw new AppError('Cannot delete admin users', 403);
    }

    await user.destroy();
}
