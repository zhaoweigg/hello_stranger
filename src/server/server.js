var util = require('util');

var uuid = require('uuid');
var express = require('express');
var mysql = require('mysql');
var bodyparse = require('body-parser');

var app = express();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '11',
    database: 'test'
});

var table = 'user_location';

// Parse application/x-www-form-urlencoded
app.use(bodyparse.urlencoded({ extended: false}));

// Parse application/json
app.use(bodyparse.json());

/* Get 10 most nearby users  */
app.get('/location/:uid/', function(req, res) {
    var latt = req.body.lattitude;
    var longt = req.body.longtitude;
    uid = req.params.uid;
    console.log(uid);

    var sql = util.format('SELECT id FROM %s WHERE location=?', table);
    connection.query(sql, [0], function(err, result) {
        if (err) {
        }
        else {
            console.log(result);
        }
    });
    res.send('Get Rquest'); 
});

/* update location of certain user */
app.post('/location/:uid/', function(req, res) {
    var uid = req.params.uid;
    var latt = req.body.lattitude;
    var longt = req.body.longtitude;
    var new_loc = 1;
    var sql = util.format('UPDATE %s SET location=?,last_update=? WHERE id=?', table);
    console.log(uid);
    connection.query(sql, [new_loc, new Date(), uid], function(err, result) {
        if(err) {
        }
        else {
                    
        }
    });

    res.send('Post Request');
});

/* User creation */
app.post('/user/', function(req, res) {

    console.log(req.body);
    var email = req.body.email;
    var uname = req.body.uname;
    var uid = uuid.v1().replace(/-/g, '');
    var created = mysql.escape(new Date());
    var sql = util.format('INSERT INTO %s VALUES(?, ?, ?, 0, ?)', table);

    connection.query(sql, [uid, email, uname, new Date()])
    .on('error', function(err) {
        // log the error
        res.send('error creating user account');
    })
    .on('end', function() {
        res.send('Uniq user id is ' + uid);
    });

});

app.listen(3000, function() {
    /* Connct to mysql db*/
    // Need to add some clean up code to close connection when application exit out
    connection.connect( function(err) {
        if(err) {
            console.log('Error connecting to mysql');
            exit(1);
        }
        else {
            console.log('Sucessfully connected to mysql!');
            connection.query("SHOW TABLES LIKE 'userloc'", function(err, rows, fields) {
                if(err) {
                    console.log('Error testing connection!');
                    console.log(err);
                    exit(1);
                }
                else if (rows.length == 0){
                    connection.query('CREATE TABLE userloc(userID int, longt decimal(9,6), latt decimal(9, 6))', function(err, rows, fields) {
                         if(err) {
                             console.log('Error testing connection!');
                             console.log(err);
                             exit(1);
                          }
                    });
                }
            });
        }
    });

    console.log('Hello Stranger Server is up and running!'); 
});
