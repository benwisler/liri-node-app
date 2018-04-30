require("dotenv").config();
var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = "";
var userChoice = process.argv[2];
for (var i = 3; i < process.argv.length; i++) {
    userInput = userInput + " " + process.argv[i];
};
function spotifyMeCapn(){
    spotify.search({ type: 'track', query: userInput, limit: 2 }, function (error, data) {
        if (error) {
            return console.log('Error: ' + error);
        }
        var song = data.tracks.items[0];
        for (var k = 0; k < song.artists.length; k++) {
            console.log("Artist: " + song.artists[k].name)
        }
        console.log("Track: " + song.name);
        console.log("Album: " + song.album.name);
        console.log("Preview Link: " + song.external_urls.spotify);
    });
}
function displayTweets(){
    client.get('statuses/user_timeline', 'StoverDeveloper', function (error, twitters, response) {
        if (error) {
            return console.log("Error: " + error)
        }
        if (!error) {
            console.log("Tweets: \n");
            for (var j = 0; j < 20; j++){
                var tweet = twitters[j];
                console.log(tweet.text);
                console.log(tweet.created_at + "\n");
            };
        }
    });
}
function displayMovie() {
    request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (error) {
            return console.log("Error: " + error)
        }
        if (!error && response.statusCode === 200) {
            var movieInfo = JSON.parse(body);
            console.log("Title: " + movieInfo.Title)
            console.log("Year: " + movieInfo.Year)
            console.log("IMDB Rating: " + movieInfo.imdbRating)
            if (movieInfo.Ratings[1]) {
            console.log("Tomatometer: " + movieInfo.Ratings[1].Value)
            }
            else if (!movieInfo.Ratings[1]){console.log("Tomatometer: No Rating Available")}
            console.log("Country: " + movieInfo.Country);
            console.log("Language(s): " + movieInfo.Language);
            console.log("Plot: " + movieInfo.Plot);
            console.log("Actors: " + movieInfo.Actors)
        }
    })
}
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log("Error: " + error);
        }
        var arr = data.split(",");
        userChoice = arr[0];
        userInput = arr[1];
        run();
    });
}
function run() {
    if (userChoice === "my-tweets") {
        displayTweets();
    }
    else if (userChoice === "movie-this") {
        if (userInput === "") {
            userInput = "Mr. Nobody"
        }
        displayMovie();
    }
    else if (userChoice === "spotify-this-song") {
        if (userInput === "") {
            userInput = "The Sign" //logs results for 'or nah' 
        }
        spotifyMeCapn();
    }
    else if (userChoice === "do-what-it-says") {
        doWhatItSays();
    }
    else {
        return console.log("Please enter a valid command. It can be: \nmy-tweets\nmovie-this\nspotify-this-song\ndo-what-it-says")
    }
}
run()