const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

const config = mongoose.connect('mongodb+srv://bharat:Ravi.9700@pushtoken-dgxqj.azure.mongodb.net/test?retryWrites=true')

module.exports = config;
