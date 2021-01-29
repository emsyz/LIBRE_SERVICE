var express = require("express");
var consolidate = require('consolidate');
var session = require('express-session');
var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
var app = express();
var bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');

app.engine('html', consolidate.hogan)
app.set('views', 'static')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "7n)N7ny9o9SN]]Nj",
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true
  }
}));


var date = new Date();
function month(date) {
    let list_month = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    return list_month[date.getMonth()]
}
var string_date = date.getDate() + " " + month(date) + " " + date.getFullYear();


MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true} ,(err, db) => {
    if (err) throw err;
    dbo = db.db("lln");

    //création des tables si elles n'existent pas
    try {
        users = dbo.collection("users");
    }
    catch{
        dbo.createCollection("users");
        users = dbo.collection("users");
    }

    try{
        incidents = dbo.collection("incidents");
        incidents.createIndex({description : "text", address : "text", author : "text", date : "text"});
    }
    catch{
        dbo.createCollection("incidents");
        incidents = dbo.collection("incidents");
        incidents.createIndex({description : "text", address : "text", author : "text", date : "text"});
    }


    app.get('/', function(req, res) {
        incidents.find().toArray( function(err, result) {
            if (err) throw err;
            res.render("Main_page.html", { date : string_date, incidents : result, username : req.session.username });
        });
    });

    app.post('/', function(req, res){
        if (req.body.search == "") {
            res.redirect("/");
        } else {
            incidents.find({ $text : { $search : req.body.search } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } }).toArray( function(err, result) {
                if (err) throw err;
                res.render("Main_page.html", { date : string_date, incidents : result, username : req.session.username });
            });
        }
    });


    app.get('/Identification.html', function(req, res) {
        res.render("Identification.html", { error_connection : req.session.error_connection, error_inscription : req.session.error_inscription })
        req.session.error_inscription = undefined;
        req.session.error_connection = undefined;
    });

    async function registerPerson(username, password, fullname, mail){
        var salt = await(bcrypt.genSalt( 10));
        var hash_password = await bcrypt.hash( password, salt );
        users.insertOne({ username :username, password : hash_password, fullname : fullname, mail : mail });
    }

    function returnPage(page, res){
        if (page === "incident") {
            res.redirect("Incident.html");
        } else {
            res.redirect("/");
        }
    }

    app.post('/inscription', async function(req, res) {
        if (await users.findOne({username : req.body.username}) == null){
            registerPerson(req.body.username, req.body.pwd, req.body.fullname, req.body.mail);
            req.session.username = req.body.username;
            returnPage(req.session.page, res);
        } else {
            req.session.error_inscription = true;
            res.redirect("Identification.html");
        }
    });

    app.post('/connection', async function(req, res) {
        let user = await users.findOne({username : req.body.USERNAME});
        if ( user != null && bcrypt.compareSync(req.body.PWD, user.password)) {
            req.session.username = req.body.USERNAME;
            returnPage(req.session.page, res);
        } else {
            req.session.error_connection = true;
            res.redirect("Identification.html");
        }
    });

    app.get('/disconnection', function(req, res){
        req.session.username = undefined;
        res.redirect('/');
    });


    app.get('/Incident.html', function(req, res) {
        if (req.session.username){
            res.render('Incident.html', {username: req.session.username});
        } else {
            req.session.page = "incident";
            res.redirect("Identification.html");
        }
    });

    app.post('/new_incident', function(req, res){
        incidents.insertOne({description : req.body.description , address : req.body.address , author : req.session.username , date : string_date});
        res.redirect('/');
    });


app.use(express.static('static'));
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
}, app).listen(4000);
});
