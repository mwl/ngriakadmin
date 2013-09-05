var app = require('express');
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});