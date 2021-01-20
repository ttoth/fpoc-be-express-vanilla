const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    div: 'String',
    date: 'String',
    season: 'String',
    homeTeamName: 'String',
    awayTeamName: 'String',
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
    },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    winner: {
        type: String,
        enum: ['H', 'A'],
        default: 'H',
    },
    FTHG: Number,
    FTAG: Number,
    data: Object,
});

module.exports = mongoose.model('Match', schema);
