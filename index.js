// Node stuff and plugins
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    OAuth = require('oauth'),
    Twitter = require('twitter'),
    env = require('dotenv').load();

// Our twitter configs
var totalCount = 2,
	options = {
	    host: 'https://api.twitter.com',
		ID: "730505014150582272",
		count: 2
	};

var twitterReqPath = url.format({
    protocol: 'https',
    host: 'api.twitter.com',
    pathname: '/1.1/statuses/user_timeline.json',
    query: {
        'user_id': options.ID,
        'count': options.count
    }
});

var twitterPostPath = url.format({
    protocol: 'https',
    host: 'api.twitter.com',
    pathname: '/1.1/statuses/update.json',
    query: {
        'user_id': options.ID,
        'count': options.count
    }
})

// Gotta get that OAuth locked and loaded
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// max_id = "Returns results with an ID less than (that is, older than) or equal to the specified ID."
// This can be updated on load I spose, so we only get the latest tweet, if our request is max_id=XXXX
// then we'd only receive MAX 2 entries surely...

// since_id - "Returns results with an ID greater than (that is, more recent than) the specified ID."
// if we cache the most recent ID then we'll only be return data

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

var letsTweet = function(imgName) {
    client.post(twitterPostPath, { status: imgName}, function(error, tweet, response){
        if(error) console.log(error);
        console.log(tweet);  // Tweet body.
        console.log(response);  // Raw response object.
    });
}

var download = function(uri, filename, callback) {
    request
    .get(uri)
    .on('response', function(res){
        console.log(res.headers['content-type']);
        console.log(res.headers['content-length']);
    })
    .pipe(fs.createWriteStream('img/' + filename))
    .on('close', callback)
}

// Use the authorised connection to get the
// content from requested twitter acc ID
oauth.get(
    twitterReqPath,
    process.env.TWITTER_ACCESS_TOKEN_KEY,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    function(error, data, response) {
        if (error) console.log('Error: ' + error);
        var data = JSON.parse(data);
        var imgPath = data[0].entities.media[0].media_url;
        var imgName = data[0].entities.media[0].id + '.jpg';
        download(imgPath, imgName, function() {
            console.log('fired');
        });
    }
);
