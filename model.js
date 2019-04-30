const mongoose  = require('mongoose');
const Schema = mongoose.Schema
const tokenSchema = new Schema({

    id : {
        type:Number
    },
    name : {
        type:String
    },
    to : {
        type:String
    },
    device:{
        type:String

    }
})

const Tokens = mongoose.model('tokens',tokenSchema);
module.exports = Tokens;
