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

var totalCount = 2;



// max_id = "Returns results with an ID less than (that is, older than) or equal to the specified ID."
// This can be updated on load I spose, so we only get the latest tweet, if our request is max_id=XXXX
// then we'd only receive MAX 2 entries surely...

// since_id - "Returns results with an ID greater than (that is, more recent than) the specified ID."
// if we cache the most recent ID then we'll only be return data


var options = {
    host: 'https://api.twitter.com/1.1/statuses/user_timeline.json?',
    queries: 'user_id=730505014150582272&count=2'
};

// Set our OAuth up
var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);

// Use the authorised connection to get the
// content from requested twitter acc ID
oauth.get(
    options.host + options.queries,
    process.env.TWITTER_ACCESS_TOKEN_KEY,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    function(error, data, response) {
        console.log(options.host + options.queries);
        if (error) console.log('Error: ' + error);
        data = JSON.parse(data);
        console.log(JSON.stringify(data, 0, 2));
    }
)
