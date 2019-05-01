const mongoose  = require('mongoose');
const Schema = mongoose.Schema
const tweetsSchema = new Schema({

    id : {
        type:Number
    },
    tweet : {
        type:String
    },
    to : {
        type:String
    },
    device:{
        type:String

    }
})

const Tweets = mongoose.model('tweets',tweetsSchema);
module.exports = Tweets;
