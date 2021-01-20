const logger = require('../utils/logger');
const config = require('../utils/config');
const matchService = require('./match.service');
const tournamentService = require('./tournament.service');

/**
 * All of the events land here from Redis, the routing happens by the job type
 * @param {Object} job
 * @return {Promise<number>}
 */
handleMessageBusEvent = async function (job) {
    switch (job.name) {
    case config.messaging.NEW_TOURNAMENT_EVENT_NAME:
        await tournamentService.addTournament(job.data);
        break;
    case config.messaging.NEW_MATCH_EVENT_NAME:
        await matchService.addMatch(job.data);
        break;
    default:
        logger.warn(`handleMessageBusEvent router encountered an unhandled job type: ${job.name}`);
    }
    return 1;
};

module.exports.handleMessageBusEvent = handleMessageBusEvent;
