import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { AttemptAttributes, Grade, EvaluatorType } from '../types';

interface AttemptCreationAttributes extends Optional<AttemptAttributes, 'id' | 'suggestions' | 'strengths' | 'wordCount' | 'createdAt' | 'updatedAt' | 'deletedAt'> { }

class Attempt extends Model<AttemptAttributes, AttemptCreationAttributes> implements AttemptAttributes {
    declare id: string;
    declare userId: string;
    declare challengeId: string;
    declare promptText: string;
    declare totalScore: number;
    declare grade: Grade;
    declare clarityScore: number;
    declare specificityScore: number;
    declare contextScore: number;
    declare structureScore: number;
    declare completenessScore: number;
    declare suggestions: string[];
    declare strengths: string[];
    declare evaluatorType: EvaluatorType;
    declare wordCount: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare readonly deletedAt: Date | null;
}

export function initAttempt(sequelize: Sequelize): typeof Attempt {
    Attempt.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            challengeId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'challenges',
                    key: 'id',
                },
            },
            promptText: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            totalScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            grade: {
                type: DataTypes.ENUM('S', 'A', 'B', 'C', 'D', 'F'),
                allowNull: false,
            },
            clarityScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            specificityScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            contextScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            structureScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            completenessScore: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            suggestions: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            strengths: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            evaluatorType: {
                type: DataTypes.ENUM('ai', 'heuristic'),
                allowNull: false,
            },
            wordCount: {
                type: DataTypes.INTEGER,
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
            tableName: 'attempts',
            paranoid: true,
            timestamps: true,
        }
    );

    return Attempt;
}

export default Attempt;
