const express = require('express');
const router = new express.Router();
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const tournamentService = require('../services/tournament.service');

router.get('/', async (req, res) => {
    const tournaments = await Tournament.find();
    res.send(tournaments);
});

router.post('/', async (req, res) => {
    res.send(tournamentService.addTournament(req.body));
});

router.get('/getBiggestMarginRobustMatchByTournament', async (req, res) => {
    const tournament = await tournamentService.getBiggestMarginRobustMatchByTournament(req.body.code);
    res.send(tournament);
});

router.get('/:div/:season/matches', async (req, res) => {
    // To make it more clean: create a param validator middleware
    if (!req.params.div || !req.params.season) {
        res.status(404).send('A required parameter is missing');
    } else {
        const matches = await Match.find({div: req.params.div, season: req.params.season});
        res.send(matches);
    }
});

module.exports = router;
