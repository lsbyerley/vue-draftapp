const router = require('express').Router();
const cache = require('../utils/cache');
const fs = require('fs');
const { fileExists } = require('../utils/util');
const whilst = require('async/whilst');

router.get('/players/:update?/:total?', (req, res) => {

	let updatePlayers = false
	if (req.params.update && req.params.update === 'update') {
		updatePlayers = true
	}

	let total = 1200
	if (req.params.total && parseInt(req.params.total) !== 'NaN') {
		total = req.params.total
	}

	if (req.isAuthenticated()) {
		yf.setUserToken(req.user.access_token);

		const leagueKey = config.LEAGUE_KEY;
		const year_key = leagueKey.substring(0, 3);

		var playersFilePath = __basedir + '/public/player-data/players-' + year_key + '.json';
		if (fileExists(playersFilePath) && !updatePlayers) {
			console.log('FETCH PLAYERS FILE');
			fs.readFile(playersFilePath, 'utf-8', function(err, data) {
				if (!err) {
					data = JSON.parse(data);
					return res.status(200).json(data);
				} else {
					console.error(err)
					return res.status(500).json({ 'error': 'PLAYERSJSONERROR: '+err })
				}
			});
		} else {
			console.log('BUILDING PLAYERS FILE');
			let start = 0;
			let playersCollection = [];

			whilst(
				function() {
					//return start <= 1200;
					return start <= total;
				},
				function(callback) {
					yf.players.leagues(leagueKey, { start: start }, function(err, data) {
						if (!err) {
							let players = data[0].players;
							players.forEach((player) => {
								//console.log(player)
								let hsUrl = player.headshot.url
								let hsUrlx2
								let splits = hsUrl.split('-/')
								if (splits && splits.length == 2) {
									hsUrlx2 = splits[1]
								}
								playersCollection.push({
									player_key: player.player_key,
									player_id: player.player_id,
									name: `${player.name.ascii_first} ${player.name.ascii_last}`,
									position: player.display_position,
									team: player.editorial_team_full_name,
									team_abbrev: player.editorial_team_abbr,
									headshot: hsUrl,
									headshotx2: hsUrlx2
								});
							});

							start += 25;
							console.log('Total Players: ', playersCollection.length);
							callback();
						} else {
							console.error(err)
							return res.status(500).json({ 'error': 'PLAYERSFETCHERROR: '+err })
						}
					});
				},
				function(err) {
					var json_str = JSON.stringify(playersCollection);
					fs.writeFile(__basedir+'/public/player-data/players-' + year_key + '.json', json_str, function(err) {
						if (!err) {
							console.log('Players file saved!');
						} else {
							console.error(err);
						}
					});

					return res.status(200).json(playersCollection)
				}
			);
		}

	} else {
		return res.status(401).json({error: 'unauthorized'})
	}

});

module.exports = router;
