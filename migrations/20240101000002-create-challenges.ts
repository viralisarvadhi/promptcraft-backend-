import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('challenges', {
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
            defaultValue: null,
        },
    });

    await queryInterface.addIndex('challenges', ['category']);
    await queryInterface.addIndex('challenges', ['difficulty']);
    await queryInterface.addIndex('challenges', ['isActive']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('challenges');
}
