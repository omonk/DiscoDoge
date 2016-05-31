var request = require('request');
var OAuth = require('oauth');
var Twitter = require('twitter');
var env = require('dotenv').load();

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var options = {
    host: 'https://api.twitter.com',
    path: '/1.1/statuses/user_timeline.json?user_id=730505014150582272'
};

var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);
oauth.get(
    options.host + options.path,
    process.env.TWITTER_ACCESS_TOKEN_KEY,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    function(error, data, response) {
        if (error) console.log('Error: ' + error);
        data = JSON.parse(data);
        console.log(JSON.stringify(data, 0, 2));
    }
)
