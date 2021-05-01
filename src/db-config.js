
const dbName = process.env.MYSQL_DATABASE;
const dbPass = process.env.MYSQL_ROOT_PASSWORD;

module.exports = {
    "development": {
        "username": "root",
        "password": dbPass,
        "database": dbName,
        "host": "mysqldb",
        "dialect": "mysql",
    },
    "production": {
        "username": "root",
        "password": dbPass,
        "database": dbName,
        "host": "mysqldb",
        "dialect": "mysql"
    }
};