const { ROLES } = require('../../lib/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      unique: 'email',
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(ROLES),
      defaultValue: 'user',
      allowNull: false,
    },
  });

  return User;
};
