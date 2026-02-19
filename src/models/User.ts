import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserAttributes, UserPublic, UserRole } from '../types';

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'totalAttempts' | 'bestScore' | 'averageScore' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: string;
    declare username: string;
    declare email: string;
    declare passwordHash: string;
    declare role: UserRole;
    declare totalAttempts: number;
    declare bestScore: number;
    declare averageScore: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }

    public toPublic(): UserPublic {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            totalAttempts: this.totalAttempts,
            bestScore: this.bestScore,
            averageScore: this.averageScore,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

export function initUser(sequelize: Sequelize): typeof User {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user',
            },
            totalAttempts: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            bestScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            averageScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'users',
            paranoid: true,
            timestamps: true,
            hooks: {
                beforeCreate: async (user: User) => {
                    if (user.passwordHash) {
                        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
                    }
                },
                beforeUpdate: async (user: User) => {
                    if (user.changed('passwordHash')) {
                        user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
                    }
                },
            },
        }
    );

    return User;
}

export default User;
