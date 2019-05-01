const Twitter = require('twitter');
const Tokens = require('./model')
const Tweets = require('./tweet_model');
const config = require('./db')
const fetch = require('node-fetch');
const googleTranslate = require('google-translate')('AIzaSyBIIMSchpZjwJuggYH5TIQaW8Ew9Bb_PtE');
const moment = require('moment');



module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: '9MzzQgdcQWmRckmseqkXZg4uZ',
        consumer_secret: '2ABcRhCAFHxmjTOKeUrtlcmnKdM3YQmPKyGwqjxHE3X1lcKenK',
        access_token_key: '153031481-v6v7hL4sgBjQ9GzwhwTp253AsJ145FwNdhs4fv79',
        access_token_secret: 'mAgSPSp1xKd1ed5F5o5LXVPRnb7HTuHyHOMkJZ1lUUrBY'
    });

    let twitterStream;

    app.locals.searchTerm = 'JavaScript'; //Default search term for twitter stream.
    app.locals.showRetweets = false; //Default


    twitter.stream('statuses/filter', {follow: 153031481 || 1259475811}, (stream) => {
        stream.on('data',  (tweet) => {
            console.log('tweer',tweet.text)
            const date = moment(Date.now()).format("D/MM/YYYY hh:mm")
            if (tweet.extended_tweet) {
                googleTranslate.translate(tweet.extended_tweet.full_text, 'en', function (err, translation) {
                    sendNotification(translation.translatedText)
                    const tweet = new Tweets({tweet:translation.translatedText,time:date});
                    tweet.save()
                });

            }else {
                googleTranslate.translate(tweet.text, 'en', function (err, translation) {
                    sendNotification(translation.translatedText)
                    const tweet = new Tweets({tweet:translation.translatedText,time:date});
                    tweet.save()
                });

            }

        })
        stream.on('error', (error) => {
            console.log(error);
        });
    });

    const sendNotification = (text) => {
        console.log('loggeed text',text)
        Tokens.find({}).then(result => {
            result.forEach(item => {
                fetch('https://exp.host/--/api/v2/push/send', {
                    body: JSON.stringify({
                        to: item.to,
                        title: 'RER-B',
                        body: text
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                });
            });

        })
    }
    /**
     * Sets search term for twitter stream.
     */

    app.post('/tokens', (req, res) => {
        const sevran = Tokens.find({to: req.body.to}).then(result => {
            console.log('already exist', result);
            if (result.length === 0) {
                const token = new Tokens(req.body);
                token.save()
            }
            res.send(result);
        })
            .catch(err => console.log('error duude', err))

    })
    app.get('/tweets', (req, res) => {
        const sevran = Tweets.find({}).limit(10).then(result => {
            res.send(result);
        })
            .catch(err => console.log('error duude', err))
    })


    /**
     * Resumes the twitter stream.

    //Establishes socket connection.

    /**
     * Emits data from stream.
     * @param {String} msg
     */
};
