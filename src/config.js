const path = require("path");
const {validate} = require("node-cron");
const env = require("dotenv").config();
const { createUrl } = require("src/utils/helpers");
const dbConfig = require("./db-config");

const cronSchedule = process.env.CRON_SCHEDULE;

if (!validate(cronSchedule)) { // check if cron schedule format is vlaid
    throw new Error("Cron schedule format is not valid");
}

const apiBase  = 'https://min-api.cryptocompare.com/';
const dbName = process.env.MYSQL_DATABASE;
const dbPass = process.env.MYSQL_ROOT_PASSWORD;
const dbPort = process.env.MYSQL_PORT;
const hostname = process.env.NODE_LOCAL_HOSTNAME;
const fsymsParsed = process.env.FSYMS.split(",");
const tsymsParsed = process.env.TSYMS.split(",");
module.exports = {
    static: path.join(__dirname, 'views'),
    port: process.env.NODE_DOCKER_PORT,
    localPort: process.env.NODE_LOCAL_PORT,
    socketMs: process.env.SOCKET_MS,
    hostname,
    dbName,
    dbPass,
    dbPort,
    cronSchedule,
    fsymsParsed,
    tsymsParsed,
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
    env: process.env.NODE_ENV,
    logFolder: path.join(__dirname, '../', 'logs'),
    appErrorsLogFile: path.join(__dirname, '../', 'logs', 'app-errors.log'),
    webLogs: path.join(__dirname, '../', 'logs', 'web.log'),
    api: {
        base: apiBase,
        pricemultifull: {
            url: createUrl(apiBase, "data/pricemultifull", { fsyms: process.env.FSYMS, tsyms: process.env.TSYMS }),
        }
    },
    db: dbConfig
};