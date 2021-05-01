'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class list_coins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  list_coins.init({
    coin_name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'list_coins',
  });
  return list_coins;
};