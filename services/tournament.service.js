const Tournament = require('../models/Tournament');
const Match = require('../models/Match');

addTournament = async function (tournamentData) {
    const tournament = await Tournament.findOneAndUpdate(
        {code: tournamentData.code},
        {
            code: tournamentData.code,
            name: tournamentData.name,
            div: tournamentData.div,
            season: tournamentData.season,
            location: tournamentData.location,
        },
        {new: true, upsert: true});
    return tournament;
};

/**
 * Finds the Match with biggest margin in the given tournament.
 * When there are multiple fitting matches the precedence order is:
 * - less goal conceded
 * - happened earlier
 * @param {String} code tournament code
 * @return {Promise<any>}
 */
getBiggestMarginRobustMatchByTournament = async function (code) {
    let match = null;
    const tournament = await Tournament.find({code: code});
    if (!tournament) throw Error(`No tournament with ${code} tournamentCode has been found!`);
    const matches = await Match.find({tournament: tournament._id});
    if (matches && matches.length) {
        match = matches[0];
        matches.forEach((element) => {
            const marginRecord = Math.abs(match.FTAG - match.FTHG);
            const marginCurrent = Math.abs(element.FTAG - element.FTHG);
            const totalGoalsRecord = match.FTAG + match.FTHG;
            const totalGoalsCurrent = match.FTAG + match.FTHG;
            if (marginCurrent > marginRecord ||
                (marginCurrent === marginRecord && totalGoalsRecord > totalGoalsCurrent) ||
                (marginCurrent === marginRecord && totalGoalsRecord === totalGoalsCurrent &&
                    Date(element.date) < Date(match.date))) match = element;
        });
    }
    return match;
};

module.exports = {addTournament, getBiggestMarginRobustMatchByTournament};
