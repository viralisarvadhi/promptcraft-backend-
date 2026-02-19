import { countWords, getGrade, heuristicEvaluate } from '../../src/utils/evaluator';
import { ChallengeAttributes } from '../../src/types';

describe('Evaluator Utils', () => {
    describe('countWords', () => {
        it('should count words correctly', () => {
            expect(countWords('Hello world')).toBe(2);
            expect(countWords('  Multiple   spaces   between  ')).toBe(3);
            expect(countWords('')).toBe(0);
            expect(countWords('Single')).toBe(1);
        });
    });

    describe('getGrade', () => {
        it('should return correct grade for score ranges', () => {
            expect(getGrade(10)).toBe('S');
            expect(getGrade(9.5)).toBe('S');
            expect(getGrade(9.0)).toBe('S');
            expect(getGrade(8.9)).toBe('A');
            expect(getGrade(8.0)).toBe('A');
            expect(getGrade(7.9)).toBe('B');
            expect(getGrade(6.5)).toBe('B');
            expect(getGrade(6.4)).toBe('C');
            expect(getGrade(5.0)).toBe('C');
            expect(getGrade(4.9)).toBe('D');
            expect(getGrade(3.0)).toBe('D');
            expect(getGrade(2.9)).toBe('F');
            expect(getGrade(0)).toBe('F');
        });
    });

    describe('heuristicEvaluate', () => {
        const mockChallenge: ChallengeAttributes = {
            id: 'test-id',
            title: 'Test Challenge',
            category: 'Backend',
            difficulty: 'Intermediate',
            instruction: 'Build a REST API',
            tips: [
                'Define resources and HTTP methods',
                'Mention authentication method',
                'Specify pagination',
            ],
            examplePrompt: 'Example prompt',
            tags: ['API', 'REST'],
            estimatedMinutes: 15,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        it('should evaluate a short prompt with low scores', () => {
            const result = heuristicEvaluate('Build API', mockChallenge);

            expect(result.evaluatorType).toBe('heuristic');
            expect(result.wordCount).toBe(2);
            expect(result.totalScore).toBeLessThan(5);
            expect(result.grade).toMatch(/[CDF]/);
            expect(result.suggestions.length).toBeGreaterThan(0);
        });

        it('should evaluate a detailed prompt with higher scores', () => {
            const detailedPrompt = `
        Create a RESTful API for user management with the following endpoints:
        GET /api/users - List all users with pagination support
        POST /api/users - Create new user with validation
        PUT /api/users/:id - Update user information
        DELETE /api/users/:id - Remove user from system
        
        Use JWT authentication for all endpoints.
        Implement role-based access control with admin and user roles.
        Add pagination with page and limit query parameters.
        Return consistent JSON responses with proper error handling.
        Use Express.js with TypeScript and PostgreSQL database.
      `;

            const result = heuristicEvaluate(detailedPrompt, mockChallenge);

            expect(result.evaluatorType).toBe('heuristic');
            expect(result.wordCount).toBeGreaterThan(50);
            expect(result.totalScore).toBeGreaterThan(5);
            expect(result.clarityScore).toBeGreaterThan(0);
            expect(result.specificityScore).toBeGreaterThan(0);
            expect(result.contextScore).toBeGreaterThan(0);
            expect(result.structureScore).toBeGreaterThan(0);
            expect(result.completenessScore).toBeGreaterThan(0);
            expect(result.strengths.length).toBeGreaterThan(0);
        });

        it('should cap individual scores at 2.0', () => {
            const excellentPrompt = `
        Design a comprehensive RESTful API for an e-commerce platform.
        
        Resources and Endpoints:
        1. Products: GET /products, POST /products, PUT /products/:id, DELETE /products/:id
        2. Users: GET /users, POST /users, PUT /users/:id
        3. Orders: GET /orders, POST /orders, GET /orders/:id
        
        Authentication: JWT-based authentication with refresh tokens
        Authorization: Role-based access control (admin, seller, customer)
        Pagination: Support page and limit query parameters for all list endpoints
        Filtering: Allow filtering by category, price range, and availability
        
        Error Handling: Return consistent error responses with status codes
        Validation: Use Zod for request body validation
        Database: PostgreSQL with Sequelize ORM
        
        The API should be built for a business-to-consumer e-commerce platform
        where sellers can list products and customers can browse and purchase.
      `;

            const result = heuristicEvaluate(excellentPrompt, mockChallenge);

            expect(result.clarityScore).toBeLessThanOrEqual(2.0);
            expect(result.specificityScore).toBeLessThanOrEqual(2.0);
            expect(result.contextScore).toBeLessThanOrEqual(2.0);
            expect(result.structureScore).toBeLessThanOrEqual(2.0);
            expect(result.completenessScore).toBeLessThanOrEqual(2.0);
            expect(result.totalScore).toBeLessThanOrEqual(10.0);
        });
    });
});
