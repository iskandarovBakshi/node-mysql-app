'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class display_detail extends Model {
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.display_detail.belongsTo(models.list_coins, {foreignKey: 'coin_id'});
      models.display_detail.belongsTo(models.currencies, {foreignKey: 'currency_id'});
    }
  };
  display_detail.init({
    change24hour: DataTypes.STRING(50),
    changepct24hour: DataTypes.STRING(50),
    open24hour: DataTypes.STRING(20),
    volume24hour: DataTypes.STRING(50),
    volume24hourto: DataTypes.STRING(50),
    high24hour: DataTypes.STRING(20),
    price: DataTypes.STRING(20),
    tosymbol: DataTypes.STRING(5),
    lastupdate: DataTypes.STRING(30),
    fromsymbol: DataTypes.STRING(5),
    supply: DataTypes.STRING(50),
    mktcap: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'display_detail',
  });
  return display_detail;
};