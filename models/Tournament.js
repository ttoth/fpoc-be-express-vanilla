const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    // code: This is the unique ID used outside of the app, consist of div_season
    code: {type: String, required: true, unique: true},
    // div: This is the ID the data provider uses for leagues/divisions, example E0 = English PL
    div: {type: String, required: true},
    season: {type: String, required: true},
    location: String,
});

module.exports = mongoose.model('Tournament', schema);
