const express = require('express');
const router = new express.Router();
const Match = require('../models/Match');

router.get('/', async (req, res) => {
    const matches = await Match.find();
    res.send(matches);
});

module.exports = router;
