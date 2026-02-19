import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { ChallengeAttributes, ChallengeCategory, ChallengeDifficulty } from '../types';

interface ChallengeCreationAttributes extends Optional<ChallengeAttributes, 'id' | 'estimatedMinutes' | 'isActive' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

class Challenge extends Model<ChallengeAttributes, ChallengeCreationAttributes> implements ChallengeAttributes {
    declare id: string;
    declare title: string;
    declare category: ChallengeCategory;
    declare difficulty: ChallengeDifficulty;
    declare instruction: string;
    declare tips: string[];
    declare examplePrompt: string;
    declare tags: string[];
    declare estimatedMinutes: number;
    declare isActive: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

export function initChallenge(sequelize: Sequelize): typeof Challenge {
    Challenge.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            category: {
                type: DataTypes.ENUM(
                    'UI/UX Design',
                    'Backend',
                    'AI Prompting',
                    'Database',
                    'DevOps',
                    'Data Science'
                ),
                allowNull: false,
            },
            difficulty: {
                type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
                allowNull: false,
            },
            instruction: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            tips: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            examplePrompt: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            estimatedMinutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
            tableName: 'challenges',
            paranoid: true,
            timestamps: true,
        }
    );

    return Challenge;
}

export default Challenge;
