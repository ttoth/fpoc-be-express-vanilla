const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const IORedis = require('ioredis');
const BullMQ = require('bullmq');

const logger = require('./utils/logger');
const config = require('./utils/config');
const tournamentRouter = require('./routes/tournament.route');
const matchRouter = require('./routes/match.route');
const queueEventHandler = require('./services/queue-event-handler.service');

(async () => {
    try {
        // Connect to MongoDB database
        await mongoose.connect(config.db.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        // Join to the message queue
        const connection = new IORedis({
            host: config.redis.HOST,
            port: config.redis.PORT,
            retryStrategy (times) {
                return Math.min(times * 10000, 60000);
            },
        });
        connection.on('connect', () => {
            logger.info(`Redis connection established successfully to ${config.redis.HOST}:${config.redis.PORT}`);
        });
        connection.on('error', (error) => {
            logger.error(`Redis connection error: ${error}`);
        });
        // Route the messages
        new BullMQ.Worker(config.messaging.FOOTBALL_EVENT_QUEUE, async (job) => {
            return await queueEventHandler.handleMessageBusEvent(job);
        }, {connection: connection});


        // Finally create and start the Express application
        const app = express();

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'pug');

        app.use(morgan('dev'));
        app.use(express.json());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.urlencoded({extended: false}));
        app.use(cookieParser());

        app.use('/tournaments', tournamentRouter);
        app.use('/matches', matchRouter);

        // Generic error handler
        app.use((err, req, res, next) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

        // Bind to port as the final step
        app.listen(config.app.PORT, () => {
            logger.info(`Football POC BE vanilla Express app listening at http://localhost:${config.app.PORT}`);
        });
    } catch (error) {
        logger.error(`An (unrecoverable) error happened while starting the Express application: ${error}`);
    }
})();
