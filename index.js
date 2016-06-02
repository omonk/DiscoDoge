// Node stuff and plugins
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    OAuth = require('oauth'),
    Twitter = require('twitter'),
    env = require('dotenv').load();

// some globals

// Sets ID of most recent tweet from our source, used to check against whether to tweet or not
var mostRecentTweet = '',
    currentTweet = '';
var imgPath = '';
var imgName = '';

// timing factors
var minutes = 1,
    timeDelay = minutes * 60 * 1000;

// Our twitter configs
// count and be replaced with since_id
var options = {
        host: 'https://api.twitter.com',
		ID: "730505014150582272",
		count: 2
	};

// max_id = "Returns results with an ID less than (that is, older than) or equal to the specified ID."
// This can be updated on load I spose, so we only get the latest tweet, if our request is max_id=XXXX
// then we'd only receive MAX 2 entries surely...

// since_id - "Returns results with an ID greater than (that is, more recent than) the specified ID."
// if we cache the most recent ID then we'll only be return data
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

var letsTweet = function() {
    var data = require('fs').readFileSync('img/' + imgName + '.jpg');

    // Make post request on media endpoint. Pass file data as media parameter
    client.post('media/upload', {media: data}, function(error, media, response) {

      if (!error) {
        var status = {
          status: 'I am a tweet',
          media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status, function(error, tweet, response) {
          if (!error) {
            console.log('LETS DISCO!');
          }
        });

      }
    });
}


// Regular 15minute request....eventually.
setInterval(function() {
    var d = new Date()

    console.log("Time since last run: " + d.getHours() + ':' + d.getMinutes());

    // Use the authorised connection to get the
    // content from requested twitter acc ID
    // AKA lets make magic happen...
    oauth.get(
        twitterReqPath,
        process.env.TWITTER_ACCESS_TOKEN_KEY,
        process.env.TWITTER_ACCESS_TOKEN_SECRET,
        function(error, data, response) {

            if (error) console.log('Error: ' + error);

            var data = JSON.parse(data);

            currentTweet = data[0].id;
            imgPath = data[0].entities.media[0].media_url;
            imgName = data[0].entities.media[0].id;

            console.log('most recent tweet ID: ' + mostRecentTweet);
            if (mostRecentTweet != currentTweet) {
                download(imgPath, imgName + '.jpg', letsTweet);
                mostRecentTweet = data[0].id;
            } else {
                console.log('This dog\'s already been discoed...');
            }

        }
    );
}, timeDelay);
