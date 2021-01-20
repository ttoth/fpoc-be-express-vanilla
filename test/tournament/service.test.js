const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const tournamentService = require('../../services/tournament.service');
const Tournament = require('../../models/Tournament');
const Match = require('../../models/Match');

describe('tournamentService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getBiggestMarginRobustMatchByTournament', () => {
        it('should throw an error when there is no tournament with the given tournamentCode', async () => {
            sinon.stub(Tournament, 'find').callsFake(async () => {
                return null;
            });

            expect(tournamentService.getBiggestMarginRobustMatchByTournament('BAD_TOUR_CODE')).to.throw;
        });

        it('should return null when there is no Match (game) in the tournament', async () => {
            sinon.stub(Tournament, 'find').callsFake(async () => {
                return {};
            });
            sinon.stub(Match, 'find').callsFake(async () => {
                return [];
            });
            const match = await tournamentService.getBiggestMarginRobustMatchByTournament('EMPTY_TOUR_CODE');

            expect(match).to.be.null;
        });

        it('should select the correct Match (game)', async () => {
            sinon.stub(Tournament, 'find').callsFake(async () => {
                return TOURNAMENT_DATA_1;
            });
            sinon.stub(Match, 'find').callsFake(async () => {
                return MATCH_DATA_1;
            });
            const match = await tournamentService.getBiggestMarginRobustMatchByTournament('E0_2017_2018');

            expect(match.awayTeamName).to.be.string('Man City');
            expect(match.homeTeamName).to.be.string('Brighton');
            expect(match.date).to.be.string('12/08/2017');
        });
    });
});

const MATCH_DATA_1 = [{
    'awayTeamName': 'Leicester',
    'date': '11/08/2017',
    'div': 'E0',
    'homeTeamName': 'Arsenal',
    'FTAG': '3',
    'FTHG': '4',
    'winner': 'H',
}, {
    'awayTeamName': 'Man City',
    'date': '12/08/2017',
    'div': 'E0',
    'homeTeamName': 'Brighton',
    'FTAG': '2',
    'FTHG': '0',
    'winner': 'A',
}, {
    'awayTeamName': 'Tottenham',
    'date': '13/08/2017',
    'div': 'E0',
    'homeTeamName': 'Newcastle',
    'FTAG': '2',
    'FTHG': '0',
    'winner': 'A',
}, {
    'awayTeamName': 'West Ham',
    'date': '19/08/2017',
    'div': 'E0',
    'homeTeamName': 'Southampton',
    'FTAG': '2',
    'FTHG': '3',
    'winner': 'H',
}, {
    'awayTeamName': 'Watford',
    'date': '11/09/2017',
    'div': 'E0',
    'homeTeamName': 'Bournemouth',
    'FTAG': '2',
    'FTHG': '0',
    'winner': 'A',
}];

const TOURNAMENT_DATA_1 = {
    '_id': {
        '$oid': '600436715d47c79dcae2b581',
    },
    'code': 'E0_2017_2018',
    'division': 1,
    'leagueCode': 'E0',
    'location': 'England',
    'name': 'English Premier League 2017-2018 ABC',
    'season': '2017-2018',
};
