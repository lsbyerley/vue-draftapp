import find from 'lodash/find'

export const team_abbrevs = {
    'Seattle Seahawks': 'SEA',
    'Carolina Panthers': 'CAR',
    'Arizona Cardinals': 'ARI',
    'Denver Broncos': 'DEN',
    'Los Angeles Rams': 'LAR',
    'Houston Texans': 'HOU',
    'Kansas City Chiefs': 'KC',
    'Cincinnati Bengals': 'CIN',
    'New England Patriots': 'NE',
    'Minnesota Vikings': 'MIN',
    'New York Jets': 'NYJ',
    'Philadelphia Eagles': 'PHI',
    'Green Bay Packers': 'GB',
    'Buffalo Bills': 'BUF',
    'Pittsburgh Steelers': 'PIT',
    'Baltimore Ravens': 'BAL',
    'Oakland Raiders': 'OAK',
    'Jacksonville Jaguars': 'JAC',
    'Miami Dolphins': 'MIA',
    'Detroit Lions': 'DET',
    'Tennessee Titans': 'TEN',
    'Cleveland Browns': 'CLE',
    'San Francisco 49ers': 'SF',
    'New York Giants': 'NYG',
    'Chicago Bears': 'CHI',
    'Tampa Bay Buccaneers': 'TB',
    'Washington Redskins': 'WAS',
    'Atlanta Falcons': 'ATL',
    'Los Angeles Chargers': 'LAC',
    'Indianapolis Colts': 'IND',
    'New Orleans Saints': 'NO',
    'Dallas Cowboys': 'DAL'
};

export function insertPlayerNote(player) {

	const topOLineTeams = [
		'Philadelphia Eagles',
		'Dallas Cowboys',
		'Atlanta Falcons',
		'Pittsburgh Steelers',
		'Tennessee Titans',
		'New Orleans Saints',
		'Oakland Raiders',
		'Detroit Lions',
		'Green Bay Packers',
		'Los Angeles Rams',
		'New England Patriots',
		'Washington Redskins',
		'Chicago Bears',
		'Cleveland Browns',
		'Jacksonville Jaguars',
		'San Francisco 49ers',
		'Indianapolis Colts',
		'Kansas City Chiefs',
		'Denver Broncos'
	]

	const wrTargets = [
		// More Coming
	]

	const rbTargets = [
		// More Coming
	]

	if (topOLineTeams.includes(player.team) && player.position === 'RB') {
		player.note = 'OL+'
	}

	if (rbTargets.includes(player.name) && player.position === 'RB') {
		player.isTarget = true
	}

	if (wrTargets.includes(player.name) && player.position === 'WR') {
		player.isTarget = true
	}

	return player

}

export function insertPlayerProjections(player, projections) {

	let projection = find(projections, (p) => {
		return player.name === p.name || player.yahooPlayerName === p.name
	})
	if (projection) {
		player.ceiling = projection.ceiling
		player.floor = projection.floor
	}

	return player

}
