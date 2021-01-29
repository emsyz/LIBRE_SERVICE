var express = require("express");
var app = express();
var consolidate = require('consolidate');
var bodyParser = require("body-parser");
var session = require('express-session');

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ObjectId = require('mongodb').ObjectID;

var bcrypt = require('bcrypt');



app.engine('html', consolidate.hogan)
app.set('views', 'LINFO1212_STATIC')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "G5Hn5R98YMaG",
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true
  }
}));


MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true} ,(err, db) => {
    dbo = db.db("calendar");
    if (err) throw err;

    try {
        dbCollectionUsers = dbo.collection("users");
    }
    catch{
        dbo.createCollection("users");
        dbCollectionUsers = dbo.collection("users");
    }
    dbCollectionUsers.createIndex({"mail" : "text", "lastName" : "text", "firstName" : "text"});

    try{
        dbCollectionEvents = dbo.collection("events");
    }
    catch{
        dbo.createCollection("events");
        dbCollectionEvents = dbo.collection("events");
    }
    dbCollectionEvents.createIndex({
        "eventName" : "text",
        "briefDescription" : "text",
        "description" : "text",
        "author.firstName" : "text",
        "author.lastName" : "text",
        "author.mail" : "text",
        "address" : "text"
    });



    // PAGE D'ACCUEIL
    app.get("/", async (req, res) => {
        req.session.page = {page : "main", info : undefined};

        todayEvents = await dbCollectionEvents.find({"eventDate" : {"$eq"	: new Date(getStringDate())}}).toArray();
        events = await dbCollectionEvents.find({"eventDate" : {"$gt" : new Date(getStringDate()) }}).sort({"eventDate" : 1}).toArray();
        
        res.status(200).render("main.html", {
            "date": new Date(),
            "todayEvents" : todayEvents,
            "events" : events,
            "user": req.session.user
        });
    });


    // PAGE D'ENREGISTREMENT
    app.get("/register.html", (req, res) => {
        res.status(200).render("register.html", {"error_inscription" : req.session.error_inscription})
        req.session.error_inscription=undefined;
    });

    app.post("/register", async (req, res) => {
        if (await dbCollectionUsers.findOne({"mail" : req.body.mail}) == null){
            var salt = await bcrypt.genSalt(10);
            var hashedPassword = await bcrypt.hash( req.body.password, salt );
            dbCollectionUsers.insertOne({
                "mail" : req.body.mail,
                "password" : hashedPassword,
                "lastName" : req.body.lastName,
                "firstName" : req.body.firstName,
                "phone" : req.body.phone
            }).then(result => {
                req.session.user = {
                    "name" : req.body.firstName,
                    "id" : result.insertedId
                };
                res.redirect("/description.html");
            });
        } else {
            req.session.error_inscription = true;
            res.redirect("/register.html");
        }
    });

    // PAGE DE CONNEXION
    app.get("/login.html", (req, res) => {
	    res.status(200).render("login.html", {"error_connection" : req.session.error_connection})
	    req.session.error_connection=undefined;
    });

    app.post("/login", (req, res) => {
        dbCollectionUsers.findOne({"mail" : req.body.mail}, function(err, userInfos) {
            if (userInfos != null && bcrypt.compareSync(req.body.password, userInfos.password)) {
                req.session.user = {
                    "name" : userInfos.firstName,
                    "id" : String(userInfos._id)
                };
                returnPage(req.session.page, res);
            } else {
                req.session.error_connection = true;
                res.redirect("/login.html");
            }
        });
    });


    // DÉCONNECTION
    app.get("/disconnection", function(req, res){
        req.session.user = undefined;
        req.session.page = undefined;
        res.redirect("/");
    });


    // PAGES D'ÉVÉNEMENT
    app.get("/event.html/:id", async (req, res) => {
        req.session.page = {page : "event", info : req.params.id};

        if (req.session.user){
            try {
                var eventID = new ObjectId(req.params.id);
                var event = await dbCollectionEvents.findOne({"_id" : eventID});
                if (!event) throw new err;

                var placesRequested = 0;
                for (i = 0; i < event.members.length; i++) {
                    if (req.session.user.id == event.members[i]._id){
                        placesRequested = {
                            "lastPlacesRequested" : event.members[i].placesRequested, 
                            "placesLeft" : (event.placesLeft + event.members[i].placesRequested)
                        };
                        break;
                    }
                }
                var userIsAuthor = (req.session.user.id == event.author._id);
                var todayDate = new Date(getStringDate());
                var oldEvent = (todayDate > event.eventDate);

                res.status(200).render('event.html', {
                    "user": req.session.user,
                    "event": event,
                    "userIsAuthor": userIsAuthor,
                    "placesRequested" : placesRequested,
                    "oldEvent" : oldEvent
                });
            } catch{
                errorPage(404, res, req);
            }
        } else {
            res.redirect("/login.html");
        }
    });


    // PAGE DE CRÉATION À UN ÉVÉNEMENT
    app.get("/createEvent.html", (req,res) => {
        req.session.page = {page : "createEvent", info : undefined};
        if (req.session.user) {
            res.status(200).render('createEvent.html', {
                "user": req.session.user, 
                "minDate" : getStringDate()
            });
        } else {
            res.redirect("/login.html");
        }
    });


    app.post("/createEvent", async (req, res) => {
        try{
            var authorID = new ObjectId(req.session.user.id);
            var creator = await dbCollectionUsers.findOne({"_id" : authorID});
            delete creator.password;
            dbCollectionEvents.insertOne({
                "eventName" : req.body.eventName,
                "author" : creator,
                "briefDescription" : req.body.briefDescription,
                "description" : req.body.description,
                "eventDate" : new Date(req.body.date),
                "address" : req.body.address,
                "places" : parseInt(req.body.places),
                "placesLeft" : parseInt(req.body.places),
                "members" : [],
                "notes" : req.body.notes
            }).then(result => {
                res.redirect("/event.html/" + result.insertedId)
            });
        } catch{
            errorPage(401, res, req);
        }
    });


    // PAGE D'ÉDITION D'UN ÉVÉNEMENT
    app.get("/editEvent.html/:id", async (req, res) => {
        req.session.page = {page : "editEvent", info : req.params.id};

        if(req.session.user){
            try{
                var eventID = new ObjectId(req.params.id);
                var event = await dbCollectionEvents.findOne({"_id" : eventID, "eventDate" : {"$gte": new Date(getStringDate())}});
                if (!event) throw new err;
    
                if (event.author._id == req.session.user.id) {
                    var placesRequested = event.places - event.placesLeft;
                    var placesMin = (placesRequested) ? placesRequested : 1;

                    res.status(200).render("editEvent.html", {
                        "event" : event,
                        "user" : req.session.user,
                        "placesMin" : placesMin,
                        "placesRequested" : placesRequested,
                        "today" : getStringDate(),
                        "eventDate" : event.eventDate.toISOString().slice(0, 10)
                    });

                } else {
                    errorPage(403, res, req);
                }
            } catch{
                errorPage(404, res, req);
            }
        } else {
            res.redirect("/login.html");
        }
    });


    app.post("/updateEvent/:id", (req, res) => {
        try{
            var eventID = new ObjectId(req.params.id);
            var authorID = new ObjectId(req.session.user.id);
            dbCollectionEvents.updateOne({"_id" : eventID, "author._id" : authorID, "eventDate" : {"$gte": new Date(getStringDate())}},{
                "$set" : {
                    "eventName" : req.body.eventName,
                    "briefDescription" : req.body.briefDescription,
                    "description" : req.body.description,
                    "eventDate" : new Date(req.body.date),
                    "address" : req.body.address,
                    "places" : parseInt(req.body.places),
                    "placesLeft" : parseInt(req.body.places) - parseInt(req.body.placesRequested),
                    "notes" : req.body.notes
                }
            }).then((result) => {        
                if(result.result.nModified){
                    res.redirect("/event.html/" + req.params.id);
                } else{
                    errorPage(403, res, req);
                }
            });
        } catch{
            errorPage(403, res, req);
        }
    });


    app.post("/eventDeletion/:id", (req, res) => {
        try{
            var eventID = new ObjectId(req.params.id);
            var authorID = new ObjectId(req.session.user.id);
            dbCollectionEvents.findOneAndDelete({"_id" : eventID, "author._id" : authorID, "eventDate" : {"$gte": new Date(getStringDate())}}).then((result) => {
                if(result.value){
                    res.redirect("/");
                } else{
                   errorPage(403, res, req);
                }
            });
        } catch{
            errorPage(403, res, req);
        }
    });


    // inscription à un événement
    app.post("/eventInscription/:id", async (req,res) => {
        try{
            var userID = new ObjectId(req.session.user.id);
            try {
                var eventID = new ObjectId(req.params.id);
                var userInfos = await dbCollectionUsers.findOne({"_id" : userID}); 
                userInfos["placesRequested"] = parseInt(req.body.placesRequested);
                delete userInfos.password;
                var result = await dbCollectionEvents.updateOne({"_id" : eventID, "eventDate" : {"$gte": new Date(getStringDate())}},{
                        "$inc" : {"placesLeft" : - parseInt(req.body.placesRequested)},
                        "$addToSet" : { "members": userInfos }
                });    
                if(result.result.nModified){
                    res.redirect("/event.html/" + req.params.id);
                } else{
                    errorPage(403, res, req);
                }
            } catch{
                errorPage(404, res, req);
            }   
        } catch {
            errorPage(401, res, req);
        }
    });

    // modification de l'inscription à un événement
    app.post("/eventModificationInscription/:id", (req,res) => {
        try{
            var userID = new ObjectId(req.session.user.id);
            try {
                var eventID = new ObjectId(req.params.id);
                dbCollectionEvents.updateOne({"_id" : eventID, "members._id" : userID, "eventDate" : {"$gte": new Date(getStringDate())}},{
                    "$inc" : {"placesLeft" : + (parseInt(req.body.lastPlacesRequested) - parseInt(req.body.placesRequested)) },
                    "$set" : {"members.$.placesRequested" : parseInt(req.body.placesRequested)}
                }).then((result) => {        
                    if(result.result.nModified){
                        res.redirect("/event.html/" + req.params.id);
                    } else{
                        errorPage(403, res, req);
                    }
                });
            } catch {
                errorPage(404, res, req);
            }
        } catch{
            errorPage(401, res, req);
        }
    });

    // désincription à un événement
    app.post("/eventUnsubscribe/:id", (req,res) => {
        try{
            var userID = new ObjectId(req.session.user.id);
            try {
                var eventID = new ObjectId(req.params.id);
                dbCollectionEvents.updateOne({"_id" : eventID, "members._id" : userID, "eventDate" : {"$gte": new Date(getStringDate())}},{
                    "$inc" : {"placesLeft" : + parseInt(req.body.lastPlacesRequested)},
                    "$pull" : {"members" : {"_id" : userID}}
                }).then((result) => {        
                    if(result.result.nModified){
                        res.redirect("/");
                    } else{
                        errorPage(403, res, req);
                    }
                });
            } catch {
                errorPage(404, res, req);
            }
        } catch{
            errorPage(401, res, req);
        }
    });


    // PAGE DE PROFIL
    app.get("/profile.html/:id", async (req, res) => {
        req.session.page = {page : "profile", info : req.params.id};

        if (req.session.user){
            try{
                var searchedUserID = new ObjectId(req.params.id);
                var searchedUser = await dbCollectionUsers.findOne({"_id" : searchedUserID});
                if (!searchedUser) throw new err;

                var isUser = (req.session.user.id == searchedUserID);
                var eventOrganised =  await dbCollectionEvents.find({
                    "author._id" : searchedUserID, 
                    "eventDate" : {"$gte" : new Date(getStringDate()) }
                }).sort({"eventDate" : 1}).toArray();

                if (isUser){
                    var futureEvent = await dbCollectionEvents.find({
                        "members._id" : searchedUserID, 
                        "eventDate" : {"$gte" : new Date(getStringDate()) }
                    }).sort({"eventDate" : 1}).toArray();
                    var lastEvent = await dbCollectionEvents.find({
                        "eventDate" : {"$lt": new Date(getStringDate())}, 
                        "$or" : [{"members._id" : searchedUserID}, {"author._id" : searchedUserID}]
                    }).sort({"eventDate" : -1}).toArray();
                } else {
                    var futureEvent = undefined;
                    var lastEvent = undefined;
                }

                res.status(200).render("profile.html", {
                    "user": req.session.user,
                    "isUser" : isUser,
                    "searchedUser" : searchedUser,
                    "eventOrganised" : eventOrganised,
                    "futureEvent" : futureEvent,
                    "lastEvent" : lastEvent
                });
            } catch{
                errorPage(404, res, req);
            }
        } else {
            res.redirect("/login.html");
        }
    });


    // PAGE D'ÉDITION DU PROFIL
    app.get("/editProfile.html", (req, res) => {
        req.session.page = {page : "editProfile"};

        if(req.session.user){
            dbCollectionUsers.findOne({"_id" : new ObjectId(req.session.user.id)}, (err, userInfos) => {
                res.status(200).render('editProfile.html' , {
                    "userInfos" : userInfos ,
                    "user" : req.session.user,
                    "error_old_password" : req.session.error_old_password,
                    "error_mail_already_exist" : req.session.error_mail_already_exist,
                    "error_password" : req.session.error_password
                });
                req.session.error_old_password = undefined;
                req.session.error_mail_already_exist = undefined;
                req.session.error_password = undefined;
            });
        } else {
            res.redirect("/login.html");
        }
    });


    app.post("/editPassword", async (req,res) => {
        try{
            var userId = new ObjectId(req.session.user.id);
            var userInfos = await dbo.collection("users").findOne({"_id" : userId});
            if (bcrypt.compareSync(req.body.oldPassword, userInfos.password)) {
                var salt = await bcrypt.genSalt(10);
                var hashedPassword = await bcrypt.hash(req.body.newPassword, salt );
                await dbCollectionUsers.updateOne({ "_id" : userId}, { "$set": { "password" : hashedPassword }});
                res.redirect("/profile.html/" + req.session.user.id)
            } else {
                req.session.error_old_password = true;
                res.redirect("/editProfile.html");
            }
        } catch{
            errorPage(401, res, req);
        }
    });

    app.post("/updateProfile", async (req,res) => {
        try{
            var userId = new ObjectId(req.session.user.id);
            var userInfos = await dbo.collection("users").findOne({"_id" : userId});
            if (bcrypt.compareSync(req.body.password, userInfos.password)) {
                if (req.body.mail == userInfos.mail || await dbCollectionUsers.find({"mail" : req.body.mail}).count() == 0){
                    await dbCollectionUsers.updateOne(
                        {"_id" : userId}, 
                        {"$set" : { 
                            "firstName" : req.body.firstName , 
                            "lastName" : req.body.lastName, 
                            "phone" : req.body.phone, 
                            "mail" : req.body.mail
                        }
                    });
                    await dbCollectionEvents.updateMany(
                        {"author._id" : userId}, 
                        {"$set" : { 
                            "author.firstName" : req.body.firstName , 
                            "author.lastName" : req.body.lastName, 
                            "author.phone" : req.body.phone, 
                            "author.mail" : req.body.mail
                        }
                    });
                    await dbCollectionEvents.updateMany(
                        {"members._id" : userId}, 
                        {"$set" : { 
                            "members.$.firstName" : req.body.firstName , 
                            "members.$.lastName" : req.body.lastName, 
                            "members.$.phone" : req.body.phone, 
                            "members.$.mail" : req.body.mail
                        }
                    });
                    req.session.user.name = req.body.firstName;
                    res.redirect("/profile.html/" + req.session.user.id);
                } else{
                    req.session.error_mail_already_exist = true;
                    res.redirect("/editProfile.html");
                }
            } else{
                req.session.error_password = true;
                res.redirect("/editProfile.html");
            }
        } catch{
            errorPage(401, res, req);
        }
    });


    // PAGE DE DESCRIPTION À L'INSCRIPTION
    app.get("/description.html", (req,res) => {
        req.session.page = {page : "description"};
        res.status(200).render("description.html", {
            "user": req.session.user
        });
    });


    // PAGE "À PROPOS"
    app.get("/aboutUs.html", (req,res) => {
        req.session.page = {page : "aboutUs"};
        res.status(200).render("aboutUs.html", {
            "user": req.session.user
        });
    });

    // PAGE DE RECHERCHE
    app.post("/search", async (req, res) => {
        if(!req.session.user && !req.body.research || !req.body.research && req.session.page.page != "search"){
            returnPage(req.session.page, res);
        }
        else if (req.session.user){
            var research = (req.body.research) ? req.body.research : req.session.lastReasearch;

            req.session.page = {page : "search"};
            req.session.lastReasearch = research;

            var usersResult = await dbCollectionUsers.find(
                { "$text" : { "$search" : research }}, 
                {"score" : {"$meta" : "textScore"}}
            ).sort({ "score" : { "$meta" : "textScore"}}).toArray();
            
            var eventsResult = await dbCollectionEvents.find(
                { "$text" : { "$search" : research }, "eventDate" : {"$gte": new Date(getStringDate())}}, 
                {"score" : {"$meta" : "textScore"}}
            ).sort({ "score" : { "$meta" : "textScore"}}).toArray();

            res.status(200).render("searchResult.html" , {
                "user" : req.session.user,
                "research" : research,
                "usersResult" : usersResult,
                "eventsResult" : eventsResult
            });
        } else {
            req.session.page = {page : "search"};
            req.session.lastReasearch = req.body.research;
            res.redirect("/login.html");
        }
    });

    app.get("/event.html", (req, res) => {
        errorPage(404, res, req);
    });

    app.get("/editEvent.html", (req, res) => {
        errorPage(404, res, req);
    });

    app.get("/profile.html", (req, res) => {
        errorPage(404, res, req);
    });

    app.get("/main.html", (req, res) => {
        errorPage(404, res, req);
    });

    app.get("/searchResult.html", (req, res) => {
        errorPage(404, res, req);
    });


    app.use(express.static('LINFO1212_STATIC'));

    app.use((req, res) => {
        errorPage(404, res, req);
    });

    // REDIRECTION
    function returnPage(page, res){
        if (page == undefined){
            res.redirect("/");
        } else if (page.page === "event") {
            res.redirect("/event.html/" + page.info);
        } else if (page.page === "createEvent"){
            res.redirect("/createEvent.html");
        } else if (page.page === "editEvent"){
            res.redirect("/editEvent.html/" + page.info);
        } else if (page.page === "profile"){
            res.redirect("/profile.html/" + page.info);
        } else if (page.page === "editProfile") {
            res.redirect("/editProfile.html");
        } else if (page.page === "description"){
            res.redirect("/description.html");
        } else if (page.page === "aboutUs"){
            res.redirect("/aboutUs.html");
        } else if (page.page === "search"){
            res.redirect(307,"/search");
        } else {
            res.redirect("/");
        }
    }

    function errorPage(status, res, req){
        if (status == 404){
            var sentence = `La page que vous recherchez n'existe pas.`;
        } else if (status == 403){
            var sentence = `Vous n'avez pas les permissions requises pour effectuer cette action.`;
        } else {
            var sentence = `Utilisateur non authentifié`;
        }
        res.status(status).render('error.html', {
            user : req.session.user,
            sentence : sentence,
            type: status
        });
    }

    function getStringDate(){
        return new Date().toISOString().slice(0, 10);
    }    

});

module.exports = app;
