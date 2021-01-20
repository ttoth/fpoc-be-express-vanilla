const Match = require('../models/Match');

addMatch = async function (matchData) {
    const match = await Match.findOneAndUpdate(
        {
            div: matchData.Div,
            date: matchData.Date,
            homeTeamName: matchData.HomeTeam,
            awayTeamName: matchData.AwayTeam,
        },
        {
            div: matchData.Div,
            date: matchData.Date,
            homeTeamName: matchData.HomeTeam,
            awayTeamName: matchData.AwayTeam,
            season: matchData.season,
            winner: matchData.FTR,
            FTHG: Number.parseInt(matchData.FTHG),
            FTAG: Number.parseInt(matchData.FTAG),
            data: matchData,
        },
        {new: true, upsert: true});
    return match;
};

module.exports.addMatch = addMatch;
