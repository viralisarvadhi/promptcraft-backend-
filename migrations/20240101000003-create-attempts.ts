import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('attempts', {
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
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        challengeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'challenges',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
            defaultValue: null,
        },
    });

    await queryInterface.addIndex('attempts', ['userId']);
    await queryInterface.addIndex('attempts', ['challengeId']);
    await queryInterface.addIndex('attempts', ['totalScore']);
    await queryInterface.addIndex('attempts', ['createdAt']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('attempts');
}
