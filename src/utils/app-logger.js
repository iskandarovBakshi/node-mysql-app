const winston = require("winston");
const config = require("src/config");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'error',
            // Create the log directory if it does not exist
            filename: config.appErrorsLogFile
        })
    ],
    format: winston.format.combine(
        winston.format.label({
            label: `🔥`
        }),
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
       }),
       winston.format.colorize(),
       winston.format.prettyPrint(),
       winston.format.json(),
       winston.format.splat(),
        winston.format.printf(info => `${info.label}: ${info.level}: ${[info.timestamp]}: ${info.message}`),
    )
});

module.exports = logger;
