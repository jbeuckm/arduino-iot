var request = require('request');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var JSON2 = require('JSON2');

db = new Db('arduino-iot', new Server('localhost', 27017, {auto_reconnect: true}, {}));
db.open(function () {
    console.log("db open.");

    db.collection('logs', function (error, record_collection) {
        if (error) console.error(error);
        else {

            request('http://192.168.0.177', function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    record = JSON2.parse(body);
                    record.created_at = new Date();
                    console.log(record);
                    record_collection.save(record);

                    process.exit();
                }
            })

        }
    });

});

