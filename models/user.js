'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password_digest: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Vote, {
      foreignKey: 'userId',
      as: 'votes'
    });
  };
  return User;
};