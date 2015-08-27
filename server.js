var express = require('express')
  , csv = require('express-csv');

var Db = require('mongodb').Db;
//var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;


db = new Db('arduino-iot', new Server('localhost', 27017, {auto_reconnect: true}, {}));
db.open(function () {
    console.log("db open.");
});



var app = express();

// allow cross origin scripting to get data from devices directly
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.get('/logs.json', function(req, res) {

    db.collection('logs', function(err, record_collection){

	record_collection.find().toArray(function (err, docs) {

	    res.json(docs);

	});
    });

});

app.listen(3009);
