'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class raw_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.raw_detail.belongsTo(models.list_coins, {foreignKey: 'coin_id'});
      models.raw_detail.belongsTo(models.currencies, {foreignKey: 'currency_id'});
    }
  };
  raw_detail.init({
    change24hour: DataTypes.DOUBLE,
    changepct24hour: DataTypes.DOUBLE,
    open24hour: DataTypes.DOUBLE,
    volume24hour: DataTypes.DOUBLE,
    volume24hourto: DataTypes.DOUBLE,
    low24hour: DataTypes.DOUBLE,
    high24hour: DataTypes.DOUBLE,
    price: DataTypes.DOUBLE,
    lastupdate: DataTypes.DOUBLE,
    supply: DataTypes.DOUBLE,
    mktcap: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'raw_detail',
  });
  return raw_detail;
};