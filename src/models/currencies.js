'use strict';
const {
  Model, Sequelize, DataTypes
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class currencies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  };
  
  currencies.init({
    currency_name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'currencies',
  });
  return currencies;
};