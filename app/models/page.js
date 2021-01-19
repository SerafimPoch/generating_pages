module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {
    alias: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  return Page;
};
