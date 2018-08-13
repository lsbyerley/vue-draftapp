const fs = require("fs");
const util = require('util')

function fileExists(filePath) {
	try {
		fs.statSync(filePath);
	} catch (err) {
		if (err.code == "ENOENT") return false;
	}
	return true;
}

function formatRSSObj(json) {
	let channel = json.rss.channel;
	let rss = { items: [] };
	if (util.isArray(json.rss.channel)) channel = json.rss.channel[0];

	if (channel.title) {
		rss.title = channel.title[0];
	}
	if (channel.description) {
		rss.description = channel.description[0];
	}
	if (channel.link) {
		rss.url = channel.link[0];
	}

	// add rss.image via @dubyajaysmith
	if (channel.image) {
		rss.image = channel.image[0].url;
	}

	if (!rss.image && channel["itunes:image"]) {
		rss.image = channel["itunes:image"][0].href;
	}

	rss.image = rss.image && Array.isArray(rss.image) ? rss.image[0] : "";

	if (channel.item) {
		if (!util.isArray(channel.item)) {
			channel.item = [channel.item];
		}
		channel.item.forEach(function(val) {
			let obj = {};
			obj.title = !util.isNullOrUndefined(val.title) ? val.title[0] : "";
			obj.description = !util.isNullOrUndefined(val.description) ? val.description[0] : "";
			obj.url = obj.link = !util.isNullOrUndefined(val.link) ? val.link[0] : "";

			obj.description = obj.description.replace(/&quot;/g, '\"');

			/*if (val["itunes:subtitle"]) {
				obj.itunes_subtitle = val["itunes:subtitle"][0];
			}
			if (val["itunes:summary"]) {
				obj.itunes_summary = val["itunes:summary"][0];
			}
			if (val["itunes:author"]) {
				obj.itunes_author = val["itunes:author"][0];
			}
			if (val["itunes:explicit"]) {
				obj.itunes_explicit = val["itunes:explicit"][0];
			}
			if (val["itunes:duration"]) {
				obj.itunes_duration = val["itunes:duration"][0];
			}
			if (val["itunes:season"]) {
				obj.itunes_season = val["itunes:season"][0];
			}
			if (val["itunes:episode"]) {
				obj.itunes_episode = val["itunes:episode"][0];
			}
			if (val["itunes:episodeType"]) {
				obj.itunes_episodeType = val["itunes:episodeType"][0];
			}*/
			if (val.pubDate) {
				//lets try basis js date parsing for now
				obj.created = Date.parse(val.pubDate[0]);
			}
			if (val["media:content"]) {
				obj.media = val.media || {};
				obj.media.content = val["media:content"];
			}
			if (val["media:thumbnail"]) {
				obj.media = val.media || {};
				obj.media.thumbnail = val["media:thumbnail"];
			}
			if (val.enclosure) {
				obj.enclosures = [];
				if (!util.isArray(val.enclosure)) val.enclosure = [val.enclosure];
				val.enclosure.forEach(function(enclosure) {
					var enc = {};
					for (var x in enclosure) {
						enc[x] = enclosure[x][0];
					}
					obj.enclosures.push(enc);
				});
			}
			rss.items.push(obj);
		});
	}
	return rss;
}

const abbrev_teams = {
  'SEA': 'Seattle Seahawks',
  'CAR': 'Carolina Panthers',
  'ARZ': 'Arizona Cardinals',
  'DEN': 'Denver Broncos',
  'LAR': 'Los Angeles Rams',
  'HST': 'Houston Texans',
  'KC': 'Kansas City Chiefs',
  'CIN': 'Cincinnati Bengals',
  'NE': 'New England Patriots',
  'MIN': 'Minnesota Vikings',
  'NYJ': 'New York Jets',
  'PHI': 'Philadelphia Eagles',
  'GB': 'Green Bay Packers',
  'BUF': 'Buffalo Bills',
  'PIT': 'Pittsburgh Steelers',
  'BLT': 'Baltimore Ravens',
  'OAK': 'Oakland Raiders',
  'JAX': 'Jacksonville Jaguars',
  'MIA': 'Miami Dolphins',
  'DET': 'Detroit Lions',
  'TEN': 'Tennessee Titans',
  'CLV': 'Cleveland Browns',
  'SF': 'San Francisco 49ers',
  'NYG': 'New York Giants',
  'CHI': 'Chicago Bears',
  'TB': 'Tampa Bay Buccaneers',
  'WAS': 'Washington Redskins',
  'ATL': 'Atlanta Falcons',
  'LAC': 'Los Angeles Chargers',
  'IND': 'Indianapolis Colts',
  'NO': 'New Orleans Saints',
  'DAL': 'Dallas Cowboys'
}

module.exports = {
	fileExists,
	formatRSSObj,
	abbrev_teams
};
