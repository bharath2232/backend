
const Twitter = require('twitter');
const Tokens = require('./model')
const config = require('./db')
const fetch = require('node-fetch');




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

    /**
     * Resumes twitter stream.
     */
    const stream = () => {
        twitter.stream('statuses/filter', { follow: 153031481 }, (stream) => {
            stream.on('data', (tweet) => {
                console.log('tiwttwr',tweet);
                fetch('https://exp.host/--/api/v2/push/send', {
                    body: JSON.stringify({
                        to: 'ExponentPushToken[Do05h6FY4aZYBT1VKdPhAi]',
                        title: 'guru',
                        body: tweet.text

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                });
            });

            stream.on('error', (error) => {
                console.log(error);
            });



        });
    }

    /**
     * Sets search term for twitter stream.
     */
    app.get('/setSearchTerm', (req, res) => {
        let term = req.body.term;
        app.locals.searchTerm = term;
        stream();
    });
    app.get('/customer',(req,res)=>{
        console.log('logged')
        const sevran =  Tokens.find({}).then(result => {
            console.log('Sucess',result);
            res.send(result);
        })
            .catch(err => console.log('error duude', err) )

    })
    app.post('/tokens',(req,res)=>{
        const sevran =  Tokens.find({to:req.body.to}).then(result => {
            console.log('already exist',result);
            if (result.length === 0){
                const token = new Tokens(req.body);
                token.save()
            }
            res.send(result);
        })
            .catch(err => console.log('error duude', err) )



    })

    /**
     * Pauses the twitter stream.
     */
    app.post('/pause', (req, res) => {
        console.log('Pause');
        twitterStream.destroy();
    });

    /**
     * Resumes the twitter stream.
     */
    app.post('/resume', (req, res) => {
        console.log('Resume');
        stream();
    });

    //Establishes socket connection.
    io.on("connection", socket => {
        socketConnection = socket;
        stream();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    /**
     * Emits data from stream.
     * @param {String} msg
     */
};
