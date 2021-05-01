'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const appConfig = require('src/config');
const basename = path.basename(__filename);
const config = appConfig.db[appConfig.env];


/**
 * @typedef {{associate: () => {}} & import('sequelize').ModelCtor<any>} CustomModel
 */
/**
 * 
 * @typedef {{
 *  sequelize: Sequelize,
 *  currencies: CustomModel,
 *  list_coins: CustomModel,
 *  raw_detail: CustomModel,
 *  display_detail: CustomModel
 * }} DB
 */


/**
 * @type {DB}
 */
const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;

module.exports = db;
