
const Twitter = require('twitter');
const Tokens = require('./model')
const config = require('./db')




module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: '9MzzQgdcQWmRckmseqkXZg4uZ',
        consumer_secret: '2ABcRhCAFHxmjTOKeUrtlcmnKdM3YQmPKyGwqjxHE3X1lcKenK',
        access_token_key: '153031481-v6v7hL4sgBjQ9GzwhwTp253AsJ145FwNdhs4fv79',
        access_token_secret: 'mAgSPSp1xKd1ed5F5o5LXVPRnb7HTuHyHOMkJZ1lUUrBY'
    });

    let socketConnection;
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
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });

            twitterStream = stream;
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
        const token = new Tokens(req.body);
        const sevran =  Tokens.find({to:req.body.to}).then(result => {
            console.log('already exist',result);
            if (result.length === 0){
                token.save().then(result => {
                    console.log('Sucess',result);
                    res.send(result);
                })
                    .catch(err => console.log('error duude', err) )
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
    const sendMessage = (msg) => {
        if (msg.text.includes('RT')) {
            return;
        }
        io.emit("tweets", msg);
    }
};
