const OAuth2Strategy = require('passport-oauth2');
const request = require('request');

module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(new OAuth2Strategy(
    {
      authorizationURL: 'https://api.login.yahoo.com/oauth2/request_auth',
      tokenURL: 'https://api.login.yahoo.com/oauth2/get_token',
      clientID: config.APP_KEY,
      clientSecret: config.APP_SECRET,
      callbackURL: '/auth/yahoo/callback'
    },
    function(accessToken, refreshToken, params, profile, done) {

			const options = {
				url: 'https://social.yahooapis.com/v1/user/' + params.xoauth_yahoo_guid + '/profile?format=json',
				method: 'get',
				json: true,
				auth: {
					bearer: accessToken
				}
			};

			request(options, (error, response, body) => {
				if (!error && response.statusCode == 200) {

					return done(null,
						{
							guid: body.profile.guid,
							nickname: body.profile.nickname,
							avatar: body.profile.image.imageUrl,
							access_token: accessToken,
							refresh_token: refreshToken
						}
					)

				} else {
					console.error(error)
				}
			});

    }
	));
}
