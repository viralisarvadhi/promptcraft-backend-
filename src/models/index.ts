import sequelize from '../config/database';
import { initUser } from './User';
import { initChallenge } from './Challenge';
import { initAttempt } from './Attempt';

const User = initUser(sequelize);
const Challenge = initChallenge(sequelize);
const Attempt = initAttempt(sequelize);

// Define associations
User.hasMany(Attempt, {
    foreignKey: 'userId',
    as: 'attempts',
    onDelete: 'CASCADE',
});

Challenge.hasMany(Attempt, {
    foreignKey: 'challengeId',
    as: 'attempts',
    onDelete: 'CASCADE',
});

Attempt.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

Attempt.belongsTo(Challenge, {
    foreignKey: 'challengeId',
    as: 'challenge',
});

export { User, Challenge, Attempt };
export default { User, Challenge, Attempt };
