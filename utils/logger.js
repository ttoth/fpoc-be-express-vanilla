const {createLogger, transports, format} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [
        new transports.File({
            filename: './logs/error.log',
            level: 'error',
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new transports.File({
            filename: './logs/combined.log',
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new transports.Console(),
    ],
});

module.exports = logger;
