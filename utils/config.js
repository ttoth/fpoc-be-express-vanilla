/**
 * Usually the config files are separated by environments and sitting in different json files
 * The https://12factor.net/ says we should really keep config in the environment
 * Also, in my experience looking through a default.json a production.json and a development.json file can be painful
 * and (until a reasonable size) you can keep those in file for sake of clarity
 */
require('dotenv').config();
const _ = require('lodash');
const env = process.env.NODE_ENV || 'development'; // 'development', 'test', 'production'

const config = {
    default: {
        app: {
            PORT: parseInt(process.env.APP_PORT) || 3003,
        },
        redis: {
            HOST: '0.0.0.0',
            PORT: 6379,
        },
        db: {
            URI: process.env.DB_URI || 'mongodb://localhost:27017/football-poc',
        },
        messaging: {
            FOOTBALL_EVENT_QUEUE: 'bullmq-football',
            NEW_TOURNAMENT_EVENT_NAME: 'FOOTBALL_DATA_NEW_TOURNAMENT',
            NEW_MATCH_EVENT_NAME: 'FOOTBALL_DATA_NEW_MATCH',
        },
    },
    development: {},
    production: {},
    test: {},
};

module.exports = _.merge({}, config['default'], config[env]);
