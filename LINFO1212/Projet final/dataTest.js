var  ObjectId = require('mongodb').ObjectID;
var tomorrowDate = new Date(new Date().toISOString().slice(0,10));
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
var twodayslater = new Date(new Date().toISOString().slice(0,10));
twodayslater.setDate(twodayslater.getDate() + 2);
var yesterdayDate = new Date(new Date().toISOString().slice(0,10));
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

var user1 = 
    {
        "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
        "mail": "test1@test1",
        "password": "$2b$10$kFDyGE3anybu//mwP5ygjOjD56JrrgFAP3x5eR3m/pkGEsSu67H9u",
        "lastName": "test1",
        "firstName": "test1",
        "phone": "1111"
    };
  
var user2 = 
    {
        "_id": new ObjectId("5fdf1f796678f32462137ae3"),
        "mail": "test2@test2",
        "password" :"$2b$10$.7mIVt9Hk0m6B4nyKORea./p.7eUcq5OxXECd9QD9c/xubg3Q.kpm",
        "lastName": "test2",
        "firstName": "test2",
        "phone": ""
    };

var user3 = 
    {
        "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
        "mail": "test3@test3",
        "password" :"$2b$10$WtI/CRTSh5DP0SJmdOYstezT9EsvCpooJ/5H5hz7fTf57EZC1cwtW",
        "lastName": "test3",
        "firstName": "test3",
        "phone": "333"
    };

var user4 = 
    {
        "_id": new ObjectId("5fdf1fd8e8e4903e831736d1"),
        "mail": "test4@test4",
        "password" :"$2b$10$zEbXmuWShM/DC2qpDQkrJ.Y5/6rN0DdwBUp4EV31e6cksCEAfU8iW",
        "lastName": "test4",
        "firstName": "test4",
        "phone": ""
    };
    
var passwordUser1 = "test1";
var passwordUser2 = "test2";
var passwordUser3 = "test3";
var passwordUser4 = "test4";
  
var lastEvent1 = 
    {
        "_id": new ObjectId("5fdf1fdf8cda56d48bbde9cf"),
        "eventName": "lastEvent1",
        "author": {
            "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
            "mail": "test1@test1",
            "lastName": "test1",
            "firstName": "test1",
            "phone": "1111"
        },
        "briefDescription": "this is the first last event",
        "description": "this his the description of the first last event",
        "eventDate": yesterdayDate,
        "address": "there last 1",
        "places": 3,
        "placesLeft": 1,
        "members": [
            {
                "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
                "mail": "test3@test3",
                "lastName": "test3",
                "firstName": "test3",
                "phone": "333",
                "placesRequested" :2
            }
        ],
        "notes": "notes last 1"
  };

var lastEvent2 = 
    {
        "_id": new ObjectId("5fdf1fe8f6794b28bdaf23a6"),
        "eventName": "lastEvent2",
        "author": {
            "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
            "mail": "test1@test1",
            "lastName": "test1",
            "firstName": "test1",
            "phone": "1111"
            },
        "briefDescription": "this is the second last event",
        "description": "",
        "eventDate": yesterdayDate,
        "address": "there last 2",
        "places": 4,
        "placesLeft": 4,
        "members": [],
        "notes": ""
    };

var lastEvent3 = 
    {
        "_id": new ObjectId("5fdf1ff0a30a3b0907cd5472"),
        "eventName": "lastEvent3",
        "author": {
            "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
            "mail": "test3@test3",
            "lastName": "test3",
            "firstName": "test3",
            "phone": "333"
        },
        "briefDescription": "this is the third last event",
        "description": "this is the description of the tird last event",
        "eventDate": yesterdayDate,
        "address": "there last 3",
        "places": 5,
        "placesLeft": 0,
        "members": [
            {
                "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
                "mail": "test1@test1",
                "lastName": "test1",
                "firstName": "test1",
                "phone": "1111",
                "placesRequested" : 2
            },
            {
                "_id": new ObjectId("5fdf1f796678f32462137ae3"),
                "mail": "test2@test2",
                "lastName": "test2",
                "firstName": "test2",
                "phone": "",
                "placesRequested" : 3
            }
        ],
        "notes": "notes last 3"
  };

var lastEvent4 = 
  {
      "_id": new ObjectId("5fdf9fbb2564b43be00c9813"),
      "eventName": "lastEvent4",
      "author": {
          "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
          "mail": "test1@test1",
          "lastName": "test1",
          "firstName": "test1",
          "phone": "1111"
          },
      "briefDescription": "this is the fourth last event",
      "description": "",
      "eventDate": yesterdayDate,
      "address": "there last 2",
      "places": 4,
      "placesLeft": 2,
      "members": [
        {
            "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
            "mail": "test3@test3",
            "lastName": "test3",
            "firstName": "test3",
            "phone": "333",
            "placesRequested" :2
        }
      ],
      "notes": ""
  };
  
var todayEvent1 = 
    {
        "_id": new ObjectId("5fdf1ff8194f5a7fed1af7c8"),
        "eventName": "todayEvent1",
        "author": {
            "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
            "mail": "test1@test1",
            "lastName": "test1",
            "firstName": "test1",
            "phone": "1111"
        },
        "briefDescription": "this is the first today event",
        "description": "this his the description of the first today event",
        "eventDate": new Date(new Date().toISOString().slice(0, 10)),
        "address": "there today 1",
        "places": 4,
        "placesLeft": 2,
        "members": [
            {
                "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
                "mail": "test3@test3",
                "lastName": "test3",
                "firstName": "test3",
                "phone": "333",
                "placesRequested" :2
            }
        ],
        "notes": "notes today 1"
  };
  
var todayEvent2 = 
    {
        "_id": new ObjectId("5fdf200185c39bf42184703a"),
        "eventName": "todayEvent2",
        "author": {
            "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
            "mail": "test1@test1",
            "lastName": "test1",
            "firstName": "test1",
            "phone": "1111"
        },
        "briefDescription": "this is the second today event",
        "description": "",
        "eventDate": new Date(new Date().toISOString().slice(0, 10)),
        "address": "there today 2",
        "places": 4,
        "placesLeft": 4,
        "members": [],
        "notes": ""
  };

var todayEvent3 = 
    {
        "_id": new ObjectId("5fdf200854c47eb0dde0a963"),
        "eventName": "todayEvent3",
        "author": {
            "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
            "mail": "test3@test3",
            "lastName": "test3",
            "firstName": "test3",
            "phone": "333"
        },
        "briefDescription": "this is the second today event",
        "description": "this his the description of the third today event",
        "eventDate": new Date(new Date().toISOString().slice(0, 10)),
        "address": "there today 3",
        "places": 4,
        "placesLeft": 0,
        "members": [
            {
                "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
                "mail": "test1@test1",
                "lastName": "test1",
                "firstName": "test1",
                "phone": "1111",
                "placesRequested" : 2
            },
            {
                "_id": new ObjectId("5fdf1f796678f32462137ae3"),
                "mail": "test2@test2",
                "lastName": "test2",
                "firstName": "test2",
                "phone": "",
                "placesRequested" : 2
            }
        ],
        "notes": "notes today 3"
  };


var futureEvent1 = 
    {
        "_id": new ObjectId("5fdf2011098b4b68db5060df"),
        "eventName": "futureEvent1",
        "author": {
            "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
            "mail": "test1@test1",
            "lastName": "test1",
            "firstName": "test1",
            "phone": "1111"
        },
        "briefDescription": "this is the first future event",
        "description": "this his the description of the first event",
        "eventDate": tomorrowDate,
        "address": "there future 1",
        "places": 4,
        "placesLeft": 2,
        "members": [
            {
                "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
                "mail": "test3@test3",
                "lastName": "test3",
                "firstName": "test3",
                "phone": "333",
                "placesRequested" :2
            }
        ],
        "notes": "notes future 1"
  };
  
var futureEvent2 = 
    {
        "_id": new ObjectId("5fdf20186713c4c1f5c493b7"),
        "eventName": "futureEvent2",
        "author": {
            "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
            "mail": "test1@test1",
            "lastName": "test1",
            "firstName": "test1",
            "phone": "1111"
        },
        "briefDescription": "this is the second future event",
        "description": "",
        "eventDate": twodayslater,
        "address": "future2",
        "places": 4,
        "placesLeft": 4,
        "members": [],
        "notes": ""
  };

var futureEvent3 = 
    {
        "_id": new ObjectId("5fdf202217e6d7ce016b563b"),
        "eventName": "futureEvent3",
        "author": {
            "_id": new ObjectId("5fdf1fa11cdec3d97cee5554"),
            "mail": "test3@test3",
            "lastName": "test3",
            "firstName": "test3",
            "phone": "333"
        },
        "briefDescription": "this is the third future event",
        "description": "",
        "eventDate": twodayslater,
        "address": "there future 3",
        "places": 2,
        "placesLeft": 1,
        "members": [
            {
                "_id": new ObjectId("5fdf1f3d063bc93c7c09af84"),
                "mail": "test1@test1",
                "lastName": "test1",
                "firstName": "test1",
                "phone": "1111",
                "placesRequested" : 1
            }
        ],
        "notes": ""
  };


module.exports =  {
    user1 : user1, 
    user2 : user2, 
    user3 : user3,
    user4 : user4,
    lastEvent1 : lastEvent1, 
    lastEvent2 : lastEvent2,
    lastEvent3 : lastEvent3,
    lastEvent4 : lastEvent4,
    todayEvent1 : todayEvent1, 
    todayEvent2 : todayEvent2,
    todayEvent3 : todayEvent3,
    futureEvent1 : futureEvent1,
    futureEvent2 : futureEvent2,
    futureEvent3 : futureEvent3,
    passwordUser1 : passwordUser1,
    passwordUser2 : passwordUser2,
    passwordUser3 : passwordUser3,
    passwordUser4 : passwordUser4,
    tomorrowDate : tomorrowDate,
    twodayslater : twodayslater
};
