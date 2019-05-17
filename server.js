const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3521;
const app = express();

const server = http.createServer(app);

app.use(bodyParser.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('./routes.js')(app);

server.listen(port, () => {
    console.log('server is up');
});
