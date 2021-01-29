const {Builder,By, until, Capabilities, Capability, Key, Util} = require('selenium-webdriver');
const script = require('jest');
const { beforeAll, afterAll, afterEach } = require('@jest/globals');
const MongoClient = require('mongodb').MongoClient;
const unirest = require('unirest');
var bcrypt = require('bcrypt');

var user1 = require("./dataTest.js").user1, 
    user2 = require("./dataTest.js").user2, 
    user3 = require("./dataTest.js").user3,
    user4 = require("./dataTest.js").user4, 
    lastEvent1 = require("./dataTest.js").lastEvent1, 
    lastEvent2 = require("./dataTest.js").lastEvent2,
    lastEvent3 = require("./dataTest.js").lastEvent3,
    lastEvent4 = require("./dataTest.js").lastEvent4,
    todayEvent1 = require("./dataTest.js").todayEvent1, 
    todayEvent2 = require("./dataTest.js").todayEvent2,
    todayEvent3 = require("./dataTest.js").todayEvent3,
    futureEvent1 = require("./dataTest.js").futureEvent1,
    futureEvent2 = require("./dataTest.js").futureEvent2,
    futureEvent3 = require("./dataTest.js").futureEvent3,
    passwordUser1 = require("./dataTest.js").passwordUser1,
    passwordUser2 = require("./dataTest.js").passwordUser2,
    passwordUser3 = require("./dataTest.js").passwordUser3,
    passwordUser4 = require("./dataTest.js").passwordUser4,
    tomorrowDate = require("./dataTest.js").tomorrowDate,
    twodayslater = require("./dataTest.js").twodayslater;

function get_date(d){
  var date = new Date(d);
  list_month = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return date.getDate() + " " + list_month[date.getMonth()] + " " + date.getFullYear();
}


describe('Main page', () => {

  beforeAll(async () => {
  
      connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
      dbo = connection.db("calendar");
      await dbo.collection("users").rename("saveUsers");
      await dbo.collection("events").rename("saveEvents");
      await dbo.createCollection("users");
      await dbo.createCollection("events");
  
      const capabilities = Capabilities.chrome();
      capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
      driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();
  }, 10000);
  
  afterAll(async () => {
  
      await dbo.collection("users").drop();
      await dbo.collection("events").drop();
      await dbo.collection("saveUsers").rename("users");
      await dbo.collection("saveEvents").rename("events");
      await connection.close();
      
      await driver.quit();
  }, 15000);
  
  afterEach(async () =>{
    await dbo.collection("events").deleteMany();
  }, 15000);
  

  test("Empty database", async () => {
  
      await driver.get("https://localhost:8080/");
      
      let todayEvent = await driver.findElement(By.css("section#todayEvent")).getText();
      expect(todayEvent).toContain("Aucun événement n'est prévu pour aujourd'hui.");
      
      let futureEvent = await driver.findElement(By.css("section#futureEvent")).getText();
      expect(futureEvent).toContain("Aucun événement n'est planifié durant les prochains jours.");
  
  }, 10000);
  
  
  test("Last event", async() => {
  
      await dbo.collection("events").insertOne(lastEvent1);
  
      await driver.get("https://localhost:8080/");
      let todayEvent = await driver.findElement(By.css("section#todayEvent")).getText();
      expect(todayEvent).toContain("Aucun événement n'est prévu pour aujourd'hui.");
      let futureEvent = await driver.findElement(By.css("section#futureEvent.grid.main_grid")).getText();
      expect(futureEvent).toContain("Aucun événement n'est planifié durant les prochains jours.");
  
  }, 10000);
  
  
  test("Today event", async() => {
  
      await dbo.collection("events").insertOne(todayEvent1);
  
      await driver.get("https://localhost:8080/");

      let todayEvent = await driver.findElement(By.css("section#todayEvent")).getText();
      expect(todayEvent).not.toContain("Aucun événement n'est prévu pour aujourd'hui.");
      expect(todayEvent).toContain(todayEvent1.eventName);
      expect(todayEvent).toContain(todayEvent1.author.firstName);
      expect(todayEvent).toContain(todayEvent1.author.lastName);
      expect(todayEvent).toContain(todayEvent1.address);
      expect(todayEvent).toContain(((todayEvent1.placesLeft != 0) ? todayEvent1.placesLeft +"/ " + todayEvent1.places + " place(s) disponible(s)" : "Complet"));
      
      let linkEvent = await driver.findElement(By.linkText(todayEvent1.eventName)).getAttribute("href");
      expect(linkEvent).toBe("https://localhost:8080/event.html/"+todayEvent1._id);
      let linkAuthor = await driver.findElement(By.linkText(todayEvent1.author.firstName + " " + todayEvent1.author.lastName)).getAttribute("href");
      expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+todayEvent1.author._id);

      let futureEvent = await driver.findElement(By.css("section#futureEvent.grid.main_grid")).getText();
      expect(futureEvent).toContain("Aucun événement n'est planifié durant les prochains jours.");
  
  }, 10000);
  
  
  test("Future event", async() => {
  
      await dbo.collection("events").insertOne(futureEvent1);
  
      await driver.get("https://localhost:8080/");
      
      let todayEvent = await driver.findElement(By.css("section#todayEvent")).getText();
      expect(todayEvent).toContain("Aucun événement n'est prévu pour aujourd'hui.");
      
      let futureEvent = await driver.findElement(By.css("section#futureEvent.grid.main_grid")).getText();
      expect(futureEvent).not.toContain("Aucun événement n'est planifié durant les prochains jours.");
      expect(futureEvent).toContain(futureEvent1.eventName);
      expect(futureEvent).toContain(futureEvent1.author.firstName);
      expect(futureEvent).toContain(futureEvent1.author.lastName);
      expect(futureEvent).toContain(futureEvent1.address);
      expect(futureEvent).toContain(((futureEvent1.placesLeft != 0) ? futureEvent1.placesLeft +"/ " + futureEvent1.places + " place(s) disponible(s)" : "Complet"));
      expect(futureEvent).toContain(get_date(futureEvent1.eventDate));

      let linkEvent = await driver.findElement(By.linkText(futureEvent1.eventName)).getAttribute("href");
      expect(linkEvent).toBe("https://localhost:8080/event.html/"+futureEvent1._id);
      let linkAuthor = await driver.findElement(By.linkText(futureEvent1.author.firstName + " " + futureEvent1.author.lastName)).getAttribute("href");
      expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+futureEvent1.author._id);
  
  }, 10000);
  
  
  test("Last, today and future events", async() => {
  
      await dbo.collection("events").insertMany([lastEvent2, lastEvent3, todayEvent2, todayEvent3, futureEvent2, futureEvent3]);
  
      await driver.get("https://localhost:8080/");
  
      let body = await driver.findElement(By.css("body")).getText();
      expect(body).not.toContain("Aucun événement n'est prévu pour aujourd'hui.");
      expect(body).not.toContain("Aucun événement n'est planifié durant les prochains jours.");
      [lastEvent2, lastEvent3].forEach((event) => {
          expect(body).not.toContain(event.eventName);
      });
      
      let todayEvent = await driver.findElement(By.css("section#todayEvent")).getText();
      let todayTable = [todayEvent2, todayEvent3];
      for (i = 0; i < todayTable.length; i++) {
        expect(todayEvent).toContain(todayTable[i].eventName);
        expect(todayEvent).toContain(todayTable[i].author.firstName);
        expect(todayEvent).toContain(todayTable[i].author.lastName);
        expect(todayEvent).toContain(todayTable[i].address);
        expect(todayEvent).toContain(((todayTable[i].placesLeft != 0) ? todayTable[i].placesLeft +"/ " + todayTable[i].places + " place(s) disponible(s)" : "Complet"));
        let linkEvent = await driver.findElement(By.linkText(todayTable[i].eventName)).getAttribute("href");
        expect(linkEvent).toBe("https://localhost:8080/event.html/"+todayTable[i]._id);
        let linkAuthor = await driver.findElement(By.linkText(todayTable[i].author.firstName + " " + todayTable[i].author.lastName)).getAttribute("href");
        expect(linkAuthor).toBe("https://localhost:8080/profile.html/" + todayTable[i].author._id);
      }
  
      let futureEvent = await driver.findElement(By.css("section#futureEvent.grid.main_grid")).getText();
      let futureTable = [futureEvent2, futureEvent3];
      for(i = 0; i < futureTable.length; i++) {
        expect(futureEvent).toContain(futureTable[i].eventName);
        expect(futureEvent).toContain(futureTable[i].author.firstName);
        expect(futureEvent).toContain(futureTable[i].author.lastName);
        expect(futureEvent).toContain(futureTable[i].address);
        expect(futureEvent).toContain(((futureTable[i].placesLeft != 0) ? futureTable[i].placesLeft +"/ " + futureTable[i].places + " place(s) disponible(s)" : "Complet"));
        expect(futureEvent).toContain(get_date(futureTable[i].eventDate));
        let linkEvent = await driver.findElement(By.linkText(futureTable[i].eventName)).getAttribute("href");
        expect(linkEvent).toBe("https://localhost:8080/event.html/"+futureTable[i]._id);
        let linkAuthor = await driver.findElement(By.linkText(futureTable[i].author.firstName + " " + futureTable[i].author.lastName)).getAttribute("href");
        expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ futureTable[i].author._id);
      }
  
  }, 10000); 

});



describe('Register', () => {

  beforeAll(async () => {

    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.createCollection("users");
    await dbo.collection("users").insertOne(user2);

    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();
  }, 10000);
 
  afterAll(async () => {

    await dbo.collection("users").drop();
    await dbo.collection("saveUsers").rename("users");
    await connection.close();
    
    await driver.quit();
  }, 15000);

  afterEach(async() =>{
    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  });
  

  test("Register with a nonexisting email address and without phone number", async() => {

    await driver.get("https://localhost:8080/register.html");

    await driver.findElement(By.name("lastName")).sendKeys(user4.lastName);
    await driver.findElement(By.name("firstName")).sendKeys(user4.firstName);
    await driver.findElement(By.name("phone")).sendKeys(user4.phone);
    await driver.findElement(By.name("mail")).sendKeys(user4.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser4);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser4, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/description.html"), 10000);

    let users = await dbo.collection("users").find({"firstName" : user4.firstName, "lastName" : user4.lastName, "phone" : user4.phone, "mail" : user4.mail}).toArray();
    expect(users.length).toBe(1);
    if(!bcrypt.compareSync(passwordUser4, users[0].password)) throw new Error("Incorrectly saved password");

    let userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user4.firstName);
  }, 10000);


  test("Register with an existing email address and a phone number", async() => {

    await driver.get("https://localhost:8080/register.html");

    let notAddCollectionBefore = await dbo.collection("users").countDocuments();

    await driver.findElement(By.name("lastName")).sendKeys(user1.lastName);
    await driver.findElement(By.name("firstName")).sendKeys(user1.firstName);
    await driver.findElement(By.name("phone")).sendKeys(user1.phone);
    await driver.findElement(By.name("mail")).sendKeys(user2.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail déjà utilisée, veuillez en choisir une autre");
    }, 10000);

    let notAddCollection = await dbo.collection("users").countDocuments();
    expect(notAddCollection).toBe(notAddCollectionBefore);
    let notModifiedCollection = await dbo.collection("users").countDocuments(user2);
    expect(notModifiedCollection).toBe(1);

    await driver.findElement(By.name("lastName")).sendKeys(user1.lastName);
    await driver.findElement(By.name("firstName")).sendKeys(user1.firstName);
    await driver.findElement(By.name("phone")).sendKeys(user1.phone);
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/description.html"), 10000);

    let users = await dbo.collection("users").find({"firstName" : user1.firstName, "lastName" : user1.lastName, "phone" : user1.phone, "mail" : user1.mail}).toArray();
    expect(users.length).toBe(1);
    if(!bcrypt.compareSync(passwordUser1, users[0].password)) throw new Error("Incorrectly saved password");

    let userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);

  }, 60000);

});



describe('Login', () => {
  
  beforeAll(async () => {

    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertOne(user1);
    await dbo.collection("events").insertOne(futureEvent1);
    await dbo.collection("users").createIndex({"mail" : "text", "lastName" : "text", "firstName" : "text"});
    await dbo.collection("events").createIndex({
      "eventName" : "text",
      "briefDescription" : "text",
      "description" : "text",
      "author.firstName" : "text",
      "author.lastName" : "text",
      "author.mail" : "text",
      "address" : "text"
  });
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();
  }, 10000);
 
  afterAll(async () => {

    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
    
    await driver.quit();
  }, 15000);


  test("Connection with a correct password", async() =>{

    //Connection from the main page
    await driver.get("https://localhost:8080/");
    let btn = await driver.findElement(By.linkText("Connexion"));
    await driver.executeScript("arguments[0].click();", btn);
    await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
  
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
      
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);
  
    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);
     

    //Connection directly by getting the login page
    await driver.get("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);
  
    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);


    //Connection from page where user has to be connected
    listUrl = {
      0 : "https://localhost:8080/event.html/" + futureEvent1._id, 
      1 : "https://localhost:8080/createEvent.html", 
      2 : "https://localhost:8080/editEvent.html/" + futureEvent1._id,
      3 : "https://localhost:8080/profile.html/" + user1._id,
      4 : "https://localhost:8080/editProfile.html"
    }
    
    for (var URL in listUrl){
      await driver.get(`${listUrl[URL]}`);

      await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
  
      await driver.findElement(By.name("mail")).sendKeys(user1.mail);
      await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
  
      await driver.wait(until.urlIs(`${listUrl[URL]}`), 10000);
      userName = await driver.findElement(By.css("nav")).getText();
      expect(userName).toContain(user1.firstName);
  
      await driver.get("https://localhost:8080/disconnection");
      await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

      userName = await driver.findElement(By.css("nav")).getText();
      expect(userName).not.toContain(user1.firstName);    
    }

    //Connection for searching
    await driver.get("https://localhost:8080/");
    await driver.findElement(By.name("research")).sendKeys("test", Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
  
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/search"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);
    title = await driver.getTitle();
    expect(title).toContain("test");

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);
    
  }, 50000);


  test("Connection with a wrong password", async() =>{

    //Connection from the main page
    await driver.get("https://localhost:8080/");
    let btn = await driver.findElement(By.linkText("Connexion"));
    await driver.executeScript("arguments[0].click();", btn);
    await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);

    notError = await driver.findElement(By.css("blockquote")).getText();
    expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser2, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail ou mot de passe incorrect.");
    }, 10000);

    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
    await driver.findElement(By.css("button")).click();

    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/");

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);    


    //Connection directly by getting the login page
    await driver.get("https://localhost:8080/login.html");
    notError = await driver.findElement(By.css("blockquote")).getText();
    expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser2, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail ou mot de passe incorrect.");
    }, 10000);
    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName); 


    //Connection from page where user has to be connected
    listUrl = {
      0 : "https://localhost:8080/event.html/" + futureEvent1._id, 
      1 : "https://localhost:8080/createEvent.html", 
      2 : "https://localhost:8080/editEvent.html/" + futureEvent1._id,
      3 : "https://localhost:8080/profile.html/" + user1._id,
      4 : "https://localhost:8080/editProfile.html"
    };
    
    for (var URL in listUrl){
      await driver.get(`${listUrl[URL]}`);

      await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
      notError = await driver.findElement(By.css("blockquote")).getText();
      expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");

      await driver.findElement(By.name("mail")).sendKeys(user1.mail);
      await driver.findElement(By.name("password")).sendKeys(passwordUser2, Key.ENTER);

      await driver.wait(async() => {
        text = await driver.findElement(By.css("blockquote")).getText();
        return text.toString().includes("Adresse mail ou mot de passe incorrect.");
      }, 10000);
      url = await driver.getCurrentUrl();
      expect(url).toBe("https://localhost:8080/login.html");

      await driver.findElement(By.name("mail")).sendKeys(user1.mail);
      await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

      await driver.wait(until.urlIs(`${listUrl[URL]}`), 10000);
      userName = await driver.findElement(By.css("nav")).getText();
      expect(userName).toContain(user1.firstName);
      
      await driver.get("https://localhost:8080/disconnection");
      await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
      userName = await driver.findElement(By.css("nav")).getText();
      expect(userName).not.toContain(user1.firstName);
    }

    //Connection for searching
    await driver.get("https://localhost:8080/");
    await driver.findElement(By.name("research")).sendKeys("test", Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
  
    notError = await driver.findElement(By.css("blockquote")).getText();
    expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser2, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail ou mot de passe incorrect.");
    }, 10000);
    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/search"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);
    title = await driver.getTitle();
    expect(title).toContain("test");

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);

  }, 50000);


  test("Connection with an non-existent email address", async() =>{

    //Connection from the main page
    await driver.get("https://localhost:8080/");
    let btn = await driver.findElement(By.linkText("Connexion"));
    await driver.executeScript("arguments[0].click();", btn);
    await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);

    notError = await driver.findElement(By.css("blockquote")).getText();
    expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");

    await driver.findElement(By.name("mail")).sendKeys(user2.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail ou mot de passe incorrect.");
    }, 10000);

    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
    await driver.findElement(By.css("button")).click();

    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/");

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);    


    //Connection directly by getting the login page
    await driver.get("https://localhost:8080/login.html");
    notError = await driver.findElement(By.css("blockquote")).getText();
    expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");

    await driver.findElement(By.name("mail")).sendKeys(user2.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail ou mot de passe incorrect.");
    }, 10000);
    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName); 


    //Connection from page where user has to be connected
    listUrl = {
      0 : "https://localhost:8080/event.html/" + futureEvent1._id, 
      1 : "https://localhost:8080/createEvent.html", 
      2 : "https://localhost:8080/editEvent.html/" + futureEvent1._id,
      3 : "https://localhost:8080/profile.html/" + user1._id,
      4 : "https://localhost:8080/editProfile.html"
    };
    
    for (var URL in listUrl){
      await driver.get(`${listUrl[URL]}`);

      await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
      notError = await driver.findElement(By.css("blockquote")).getText();
      expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");

      await driver.findElement(By.name("mail")).sendKeys(user2.mail);
      await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

      await driver.wait(async() => {
        text = await driver.findElement(By.css("blockquote")).getText();
        return text.toString().includes("Adresse mail ou mot de passe incorrect.");
      }, 10000);
      url = await driver.getCurrentUrl();
      expect(url).toBe("https://localhost:8080/login.html");

      await driver.findElement(By.name("mail")).sendKeys(user1.mail);
      await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

      await driver.wait(until.urlIs(`${listUrl[URL]}`), 10000);
      userName = await driver.findElement(By.css("nav")).getText();
      expect(userName).toContain(user1.firstName);
      
      await driver.get("https://localhost:8080/disconnection");
      await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
      userName = await driver.findElement(By.css("nav")).getText();
      expect(userName).not.toContain(user1.firstName);
    }

    //Connection for searching
    await driver.get("https://localhost:8080/");
    await driver.findElement(By.name("research")).sendKeys("test", Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/login.html"), 10000);
  
    notError = await driver.findElement(By.css("blockquote")).getText();
    expect(notError).not.toContain("Adresse mail ou mot de passe incorrect.");
    await driver.findElement(By.name("mail")).sendKeys(user2.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(async() => {
      text = await driver.findElement(By.css("blockquote")).getText();
      return text.toString().includes("Adresse mail ou mot de passe incorrect.");
    }, 10000);
    url = await driver.getCurrentUrl();
    expect(url).toBe("https://localhost:8080/login.html");

    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/search"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).toContain(user1.firstName);
    title = await driver.getTitle();
    expect(title).toContain("test");

    await driver.get("https://localhost:8080/disconnection");
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    userName = await driver.findElement(By.css("nav")).getText();
    expect(userName).not.toContain(user1.firstName);

  }, 50000);
});



describe('Profile', () => {
    
  beforeAll(async () => {

    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertMany([user1, user2, user3, user4]);
    await dbo.collection("events").insertMany([lastEvent1, lastEvent2, lastEvent3, todayEvent1, todayEvent2, todayEvent3, futureEvent1, futureEvent2, futureEvent3]);

    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();

  }, 10000);
 
  afterAll(async () => {

    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
    
    await driver.quit();
  }, 15000);

  afterEach(async() =>{
    await driver.get("https://localhost:8080/disconnection");
  }, 15000);

  test("View user1 own profil with full events", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    await driver.get("https://localhost:8080/profile.html/" + user1._id);

    let body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain("Mon profil");

    let profile = await driver.findElement(By.css("section.profil_event")).getText();
    expect(profile).toContain(user1.firstName);
    expect(profile).toContain(user1.lastName);
    expect(profile).toContain(user1.mail);
    expect(profile).toContain(user1.phone);

    let organisedEvent = await driver.findElement(By.css("section#organisedEvent")).getText();
    let organisedTable = [todayEvent1, todayEvent2, futureEvent1, futureEvent2];
    expect(organisedEvent).not.toContain("Aucun événement n'a été trouvé pour cette section.");
    for(i = 0; i < organisedTable.length; i++){
      expect(organisedEvent).toContain(organisedTable[i].eventName);
      expect(organisedEvent).toContain(organisedTable[i].briefDescription);
      expect(organisedEvent).toContain(organisedTable[i].address);
      expect(organisedEvent).toContain(get_date(organisedTable[i].eventDate));
      expect(organisedEvent).toContain((organisedTable[i].placesLeft != 0) ? organisedTable[i].placesLeft +"/ " + organisedTable[i].places + " place(s) disponible(s)" : "Complet");
      let linkEvent = await driver.findElement(By.linkText(organisedTable[i].eventName)).getAttribute("href");
      expect(linkEvent).toBe("https://localhost:8080/event.html/"+ organisedTable[i]._id);
    }
    

    let participatingEvent = await driver.findElement(By.css("section#participatingEvent")).getText();
    let participatingTable = [todayEvent3, futureEvent3];
    expect(participatingEvent).not.toContain("Aucun événement n'a été trouvé pour cette section.");
    for(i = 0; i < participatingTable.length; i++){
      expect(participatingEvent).toContain(participatingTable[i].eventName);
      expect(participatingEvent).toContain(participatingTable[i].author.firstName + " " + participatingTable[i].author.lastName);
      expect(participatingEvent).toContain(participatingTable[i].briefDescription);
      expect(participatingEvent).toContain(participatingTable[i].address);
      expect(participatingEvent).toContain(get_date(participatingTable[i].eventDate));
      expect(participatingEvent).toContain((participatingTable[i].placesLeft != 0) ? participatingTable[i].placesLeft +"/ " + participatingTable[i].places + " place(s) disponible(s)" : "Complet");
      let linkEvent = await driver.findElement(By.linkText(participatingTable[i].eventName)).getAttribute("href");
      expect(linkEvent).toBe("https://localhost:8080/event.html/"+participatingTable[i]._id);
      let linkAuthor = await driver.findElement(By.linkText(participatingTable[i].author.firstName + " " + participatingTable[i].author.lastName)).getAttribute("href");
      expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+participatingTable[i].author._id);
    }

    let lastEvent = await driver.findElement(By.css("section#lastEvent")).getText();
    let lastTable = [lastEvent1, lastEvent2, lastEvent3];
    expect(lastEvent).not.toContain("Aucun événement n'a été trouvé pour cette section.");
    for(i = 0; i < lastTable.length; i++){
      expect(lastEvent).toContain(lastTable[i].eventName);
      expect(lastEvent).toContain(lastTable[i].author.firstName + " " + lastTable[i].author.lastName);
      expect(lastEvent).toContain(lastTable[i].briefDescription);
      expect(lastEvent).toContain(lastTable[i].address);
      expect(lastEvent).toContain(get_date(lastTable[i].eventDate));
      expect(lastEvent).toContain((lastTable[i].placesLeft != 0) ? lastTable[i].placesLeft +"/ " + lastTable[i].places + " place(s) disponible(s)" : "Complet");
      let linkEvent = await driver.findElement(By.linkText(lastTable[i].eventName)).getAttribute("href");
      expect(linkEvent).toBe("https://localhost:8080/event.html/"+lastTable[i]._id);
      let linkAuthor = await driver.findElement(By.linkText(lastTable[i].author.firstName + " " + lastTable[i].author.lastName)).getAttribute("href");
      expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+lastTable[i].author._id);
    }

  }, 50000);


  test("View user1 profil user 3 with organised events", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    await driver.get("https://localhost:8080/profile.html/" + user3._id);

    let body = await driver.findElement(By.css("body")).getText();
    
    expect(body).toContain("Profil de " + user3.firstName + " " + user3.lastName);
    expect(body).not.toContain("Participation à des événements à venir");
    expect(body).not.toContain("Evénements passés");
    let hiddenEvents = [lastEvent2, lastEvent3, todayEvent1, futureEvent1];
    for(i = 0; i < hiddenEvents.length; i++){
      expect(body).not.toContain(hiddenEvents[i].eventName);
    }


    let profile = await driver.findElement(By.css("section.profil_event")).getText();
    expect(profile).toContain(user3.firstName);
    expect(profile).toContain(user3.lastName);
    expect(profile).toContain(user3.mail);
    expect(profile).not.toContain(user3.phone);
    expect(profile).not.toContain("Numéro de téléphone");

    let organisedEvent = await driver.findElement(By.css("section#organisedEvent")).getText();
    let organisedTable = [todayEvent3, futureEvent3];
    expect(organisedEvent).not.toContain("Aucun événement n'a été trouvé pour cette section.");
    for(i = 0; i < organisedTable.length; i++){
      expect(organisedEvent).toContain(organisedTable[i].eventName);
      expect(organisedEvent).toContain(organisedTable[i].briefDescription);
      expect(organisedEvent).toContain(organisedTable[i].address);
      expect(organisedEvent).toContain(get_date(organisedTable[i].eventDate));
      expect(organisedEvent).toContain((organisedTable[i].placesLeft != 0) ? organisedTable[i].placesLeft +"/ " + organisedTable[i].places + " place(s) disponible(s)" : "Complet");
      let linkEvent = await driver.findElement(By.linkText(organisedTable[i].eventName)).getAttribute("href");
      expect(linkEvent).toBe("https://localhost:8080/event.html/"+ organisedTable[i]._id);
    }
  }, 50000);
  

  test("View user1 profil user 4 with any organised event", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    await driver.get("https://localhost:8080/profile.html/" + user4._id);

    let body = await driver.findElement(By.css("body")).getText();
    
    expect(body).toContain("Profil de " + user4.firstName + " " + user4.lastName);
    expect(body).not.toContain("Participation à des événements à venir");
    expect(body).not.toContain("Evénements passés");

    let profile = await driver.findElement(By.css("section.profil_event")).getText();
    expect(profile).toContain(user4.firstName);
    expect(profile).toContain(user4.lastName);
    expect(profile).toContain(user4.mail);
    expect(profile).not.toContain("Numéro de téléphone");

    let organisedEvent = await driver.findElement(By.css("section#organisedEvent")).getText();
    expect(organisedEvent).toContain("Aucun événement n'a été trouvé pour cette section.");
  }, 50000);


  test("View user4 own profil with any events", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user4.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser4, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    await driver.get("https://localhost:8080/profile.html/" + user4._id);

    let body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain("Mon profil");
    expect(body).toContain("Participation à des événements à venir");
    expect(body).toContain("Evénements passés");

    let profile = await driver.findElement(By.css("section.profil_event")).getText();
    expect(profile).toContain(user4.firstName);
    expect(profile).toContain(user4.lastName);
    expect(profile).toContain(user4.mail);
    expect(profile).toContain("//");

    let organisedEvent = await driver.findElement(By.css("section#organisedEvent")).getText();
    expect(organisedEvent).toContain("Aucun événement n'a été trouvé pour cette section.");    

    let participatingEvent = await driver.findElement(By.css("section#participatingEvent")).getText();
    expect(participatingEvent).toContain("Aucun événement n'a été trouvé pour cette section.");

    let lastEvent = await driver.findElement(By.css("section#lastEvent")).getText();
    expect(lastEvent).toContain("Aucun événement n'a été trouvé pour cette section.");

  }, 50000);

});



describe('Edit profile', () => {
      
  beforeAll(async () => {
    
    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertMany([user1, user2, user3, user4]);
    await dbo.collection("events").insertMany([lastEvent1, lastEvent2, lastEvent3, todayEvent1, todayEvent2, todayEvent3, futureEvent1, futureEvent2, futureEvent3]);
    
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();
    
  }, 10000);
     
  afterAll(async () => {
    
    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
        
    await driver.quit();
  }, 15000);
    
  afterEach(async() =>{
    await driver.get("https://localhost:8080/disconnection");
  }, 15000);
    

  test("Check initial values and modify input for personal informations without saving for user 1", async() => {
    
    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    await driver.get("https://localhost:8080/editProfile.html"); 
    
    firstName = await driver.findElement(By.name("firstName")).getAttribute("value");
    lastName = await driver.findElement(By.name("lastName")).getAttribute("value");
    phone = await driver.findElement(By.name("phone")).getAttribute("value");
    mail = await driver.findElement(By.name("mail")).getAttribute("value");
    expect(firstName).toBe(user1.firstName);
    expect(lastName).toBe(user1.lastName);
    expect(phone).toBe(user1.phone);
    expect(mail).toBe(user1.mail);

    await driver.findElement(By.name("lastName")).clear();
    await driver.findElement(By.name("lastName")).sendKeys(user3.lastName);
    await driver.findElement(By.name("firstName")).clear();
    await driver.findElement(By.name("firstName")).sendKeys(user3.firstName);
    await driver.findElement(By.name("phone")).clear();
    await driver.findElement(By.name("phone")).sendKeys(user3.phone);
    await driver.findElement(By.name("mail")).clear();
    await driver.findElement(By.name("mail")).sendKeys("test@test");
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);

    let btn = await driver.findElement(By.linkText("(retourner sur mon profil sans enregistrer les modifications)"));
    await driver.executeScript("arguments[0].click();", btn);

    await driver.wait(until.urlIs("https://localhost:8080/profile.html/" + user1._id));

    title = await driver.getTitle();
    expect(title).toContain(user1.firstName + " " + user1.lastName);

    usersIsModified = await dbo.collection("users").findOne(user1);
    if (!usersIsModified) throw new Error("User 1 was modified in collection user");

    authorIsModified = await dbo.collection("events").countDocuments({"author._id" : user1._id, "author.mail" : user1.mail, "author.lastName" : user1.lastName, "author.firstName" : user1.firstName, "author.phone" : user1.phone});
    if(authorIsModified != 6) throw new Error("User 1 was modified when he is an author in collection event");

    participantIsModified = await dbo.collection("events").countDocuments({"members._id" : user1._id, "members.mail" : user1.mail, "members.lastName" : user1.lastName, "members.firstName" : user1.firstName, "members.phone" : user1.phone});
    if(participantIsModified != 3) throw new Error("User 1 was modified when he is a participant in collection event");

  }, 50000);

  test("Check initial values and modify input for changing password without saving for user 4", async() => {
    
    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user4.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser4);
    await driver.findElement(By.css("button")).click();
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    await driver.get("https://localhost:8080/editProfile.html"); 
    
    firstName = await driver.findElement(By.name("firstName")).getAttribute("value");
    lastName = await driver.findElement(By.name("lastName")).getAttribute("value");
    phone = await driver.findElement(By.name("phone")).getAttribute("value");
    mail = await driver.findElement(By.name("mail")).getAttribute("value");
    expect(firstName).toBe(user4.firstName);
    expect(lastName).toBe(user4.lastName);
    expect(phone).toBe(user4.phone);
    expect(mail).toBe(user4.mail);

    await driver.findElement(By.name("oldPassword")).sendKeys(passwordUser4);
    await driver.findElement(By.name("newPassword")).sendKeys(passwordUser1);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser1);

    let btn = await driver.findElement(By.linkText("(retourner sur mon profil sans enregistrer les modifications)"));
    await driver.executeScript("arguments[0].click();", btn);

    await driver.wait(until.urlIs("https://localhost:8080/profile.html/" + user4._id));

    userIsModified = await dbo.collection("users").findOne(user4);
    if (!userIsModified) throw new Error("Password user 4 was modified");

  }, 50000);
     

  test("Edit profile user 1", async() => {
    
    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);
    await driver.findElement(By.css("button")).click();
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    await driver.get("https://localhost:8080/editProfile.html"); 
  
    //Try with a wrong password
    await driver.findElement(By.name("lastName")).clear();
    await driver.findElement(By.name("lastName")).sendKeys(user3.lastName);
    await driver.findElement(By.name("firstName")).clear();
    await driver.findElement(By.name("firstName")).sendKeys(user3.firstName);
    await driver.findElement(By.name("phone")).clear();
    await driver.findElement(By.name("phone")).sendKeys(user3.phone);
    await driver.findElement(By.name("password")).sendKeys(passwordUser3, Key.ENTER);
  
    await driver.wait(async () => {
      text = await driver.findElement(By.css("body")).getText();
      return text.toString().includes("Mot de passe incorrect");
    }, 10000);
  
    usersIsModified = await dbo.collection("users").findOne(user1);
    if (!usersIsModified) throw new Error("User 1 was modified in collection user but a wrong password was given");

    authorIsModified = await dbo.collection("events").countDocuments({"author._id" : user1._id, "author.mail" : user1.mail, "author.lastName" : user1.lastName, "author.firstName" : user1.firstName, "author.phone" : user1.phone});
    if(authorIsModified != 6) throw new Error("User 1 was modified when he is an author in collection event but a wrong password was given");

    participantIsModified = await dbo.collection("events").countDocuments({"members._id" : user1._id, "members.mail" : user1.mail, "members.lastName" : user1.lastName, "members.firstName" : user1.firstName, "members.phone" : user1.phone});
    if(participantIsModified != 3) throw new Error("User 1 was modified when he is a participant in collection event ");
  
    //Try with an already used email address
    await driver.findElement(By.name("lastName")).clear();
    await driver.findElement(By.name("lastName")).sendKeys(user2.lastName);
    await driver.findElement(By.name("firstName")).clear();
    await driver.findElement(By.name("firstName")).sendKeys(user2.firstName);
    await driver.findElement(By.name("phone")).clear();
    await driver.findElement(By.name("phone")).sendKeys(user2.phone);
    await driver.findElement(By.name("mail")).clear();
    await driver.findElement(By.name("mail")).sendKeys(user3.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
  
    await driver.wait(async() => {
      text = await driver.findElement(By.css("body")).getText();
      return text.toString().includes("L'addresse mail est déjà utilisée");
    }, 10000);
  
    usersIsModified = await dbo.collection("users").findOne(user1);
    if (!usersIsModified) throw new Error("User 1 was modified in collection user but an already email address was given");

    otherIsModified = await dbo.collection("users").findOne(user3);
    if (!otherIsModified) throw new Error("User 3 was modified in collection user by user 1");

    authorIsModified = await dbo.collection("events").countDocuments({"author._id" : user1._id, "author.mail" : user1.mail, "author.lastName" : user1.lastName, "author.firstName" : user1.firstName, "author.phone" : user1.phone});
    if(authorIsModified != 6) throw new Error("User 1 was modified when he is an author in collection event but an already email address was given");

    participantIsModified = await dbo.collection("events").countDocuments({"members._id" : user1._id, "members.mail" : user1.mail, "members.lastName" : user1.lastName, "members.firstName" : user1.firstName, "members.phone" : user1.phone});
    if(participantIsModified != 3) throw new Error("User 1 was modified when he is a participant in collection event but an already email address was given");
  
    await driver.findElement(By.name("oldPassword")).sendKeys(passwordUser1);
    await driver.findElement(By.name("newPassword")).sendKeys(passwordUser3);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser3);
  
    await driver.findElement(By.name("lastName")).clear();
    await driver.findElement(By.name("lastName")).sendKeys(user3.lastName);
    await driver.findElement(By.name("firstName")).clear();
    await driver.findElement(By.name("firstName")).sendKeys(user3.firstName);
    await driver.findElement(By.name("phone")).clear();
    await driver.findElement(By.name("phone")).sendKeys(user3.phone);
    await driver.findElement(By.name("mail")).clear();
    await driver.findElement(By.name("mail")).sendKeys("test@test");
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/profile.html/" + user1._id), 10000);
  
    title = await driver.getTitle();
    expect(title).toContain(user3.firstName + " " + user3.lastName);

    userIsModified = await dbo.collection("users").countDocuments(user1);
    if (userIsModified != 0) throw new Error("User 1 wasn't modified in collection user");

    userIsCorrectlyModified = await dbo.collection("users").countDocuments({"_id" : user1._id, "lastName" : user3.lastName, "firstName" : user3.firstName, "mail" : "test@test", "phone" : user3.phone, "password" : user1.password});
    if (userIsCorrectlyModified != 1) throw new Error("User 1 has been changed incorrectly in user's collection");

    authorIsModified = await dbo.collection("events").countDocuments({"author._id" : user1._id, "author.mail" : "test@test", "author.lastName" : user3.lastName, "author.firstName" : user3.firstName, "author.phone" : user3.phone});
    if(authorIsModified != 6) throw new Error("User1 has been changed incorrectly when he is an author in collection event");

    participantIsModified = await dbo.collection("events").countDocuments({"members._id" : user1._id, "members.mail" : "test@test", "members.lastName" : user3.lastName, "members.firstName" : user3.firstName, "members.phone" : user3.phone});
    if(participantIsModified != 3) throw new Error("User 1 has been changed incorrectly when he is a participant in collection event");
    
  }, 60000);
  
  
  test("Edit password user 3", async() => {
    
    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user3.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser3, Key.ENTER);
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    await driver.get("https://localhost:8080/editProfile.html"); 
  
    await driver.findElement(By.name("oldPassword")).sendKeys(passwordUser1);
    await driver.findElement(By.name("newPassword")).sendKeys(passwordUser2);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser2, Key.ENTER);
  
    await driver.wait(async () => {
      text = await driver.findElement(By.css("body")).getText();
      return text.toString().includes("Ancien mot de passe incorrect");
    }, 10000);
  
    userIsModified = await dbo.collection("users").countDocuments(user3);
    if (userIsModified != 1) throw new Error("User 3 was modified in collection user but a wrong password was given");
  
    await driver.findElement(By.name("lastName")).clear();
    await driver.findElement(By.name("lastName")).sendKeys(user1.lastName);
    await driver.findElement(By.name("firstName")).clear();
    await driver.findElement(By.name("firstName")).sendKeys(user1.firstName);
    await driver.findElement(By.name("phone")).clear();
    await driver.findElement(By.name("phone")).sendKeys(user1.phone);
    await driver.findElement(By.name("mail")).clear();
    await driver.findElement(By.name("mail")).sendKeys("test@test");
    await driver.findElement(By.name("password")).sendKeys(passwordUser3);
  
    await driver.findElement(By.name("oldPassword")).sendKeys(passwordUser3);
    await driver.findElement(By.name("newPassword")).sendKeys(passwordUser2);
    await driver.findElement(By.name("passwordCheck")).sendKeys(passwordUser2, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/profile.html/" + user3._id), 10000);
  
    userIsModified = await dbo.collection("users").findOne({"_id" : user3._id, "mail" : user3.mail, "firstName" : user3.firstName, "lastName" : user3.lastName});
    if (!usersIsModified) throw new Error("Not only password of user 3 was modified in collection user");
    if(!bcrypt.compareSync(passwordUser2, userIsModified.password)) throw new Error("Password has been incorrectly updated");

    authorIsModified = await dbo.collection("events").countDocuments({"author._id" : user3._id, "author.mail" : user3.mail, "author.lastName" : user3.lastName, "author.firstName" : user3.firstName, "author.phone" : user3.phone});
    if(authorIsModified != 3) throw new Error("User3 was modified when he is an author in collection event but only password has changed");

    participantIsModified = await dbo.collection("events").countDocuments({"members._id" : user3._id, "members.mail" : user3.mail, "members.lastName" : user3.lastName, "members.firstName" : user3.firstName, "members.phone" : user3.phone});
    if(participantIsModified != 3) throw new Error("User3 was modified when he is a participant in collection event but only password has changed");
  }, 50000);
  
});



describe('Create event', () => {
        
  beforeAll(async () => {
    
    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertOne(user1);
    
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();  
    
    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);
    await driver.findElement(By.css("button")).click();
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  }, 10000);
     
  afterAll(async () => {
    await driver.get("https://localhost:8080/disconnection");

    numberEvents = await dbo.collection("events").countDocuments();
    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
        
    await driver.quit();
    expect(numberEvents).toBe(2);
  }, 15000);


  test("Creation of an event without description and notes", async() => {

    await driver.get("https://localhost:8080/createEvent.html");
    
    await driver.findElement(By.name("eventName")).sendKeys(futureEvent2.eventName);
    await driver.findElement(By.name("briefDescription")).sendKeys(futureEvent2.briefDescription);
    await driver.findElement(By.name("date")).sendKeys(twodayslater.getDate() + "-" + (parseInt(twodayslater.getMonth())+1) + "-" +twodayslater.getFullYear())
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("address")).sendKeys(futureEvent2.address, Key.ENTER);

    await driver.wait(until.urlContains("https://localhost:8080/event.html/"), 10000); 

    title = await driver.getTitle();
    expect(title).toContain(futureEvent2.eventName);

    futureIsGoodRegister = await dbo.collection("events").findOne({
      "eventName" : futureEvent2.eventName, 
      "author" : futureEvent1.author, 
      "briefDescription" : futureEvent2.briefDescription,
      "description" : "", 
      "eventDate" : twodayslater, 
      "address" : futureEvent2.address, 
      "places" : 4, 
      "placesLeft" : 4, 
      "members" : [],
      "notes" : ""
    });
    if (!futureIsGoodRegister) throw new Error("The event was incorrectly registered");

  }, 50000);
 

  test("Creation of an event with a description and notes", async() => {
  
    await driver.get("https://localhost:8080/createEvent.html");
    
    await driver.findElement(By.name("eventName")).sendKeys(futureEvent1.eventName);
    await driver.findElement(By.name("briefDescription")).sendKeys(futureEvent1.briefDescription);
    await driver.findElement(By.name("description")).sendKeys(futureEvent1.description);
    await driver.findElement(By.name("date")).sendKeys(tomorrowDate.getDate() + "-" + (parseInt(tomorrowDate.getMonth())+1) + "-" +tomorrowDate.getFullYear())
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("notes")).sendKeys(futureEvent1.notes);
    await driver.findElement(By.name("address")).sendKeys(futureEvent1.address, Key.ENTER);

    await driver.wait(until.urlContains("https://localhost:8080/event.html/"), 10000); 

    title = await driver.getTitle();
    expect(title).toContain(futureEvent1.eventName);

    futureIsGoodRegister = await dbo.collection("events").findOne({
      "eventName" : futureEvent1.eventName, 
      "author" : futureEvent1.author, 
      "briefDescription" : futureEvent1.briefDescription,
      "description" : futureEvent1.description, 
      "eventDate" : tomorrowDate, 
      "address" : futureEvent1.address, 
      "places" : 2, 
      "placesLeft" : 2, 
      "members" : [],
      "notes" : futureEvent1.notes
    });
    if (!futureIsGoodRegister) throw new Error("Future1 is wrong register");

  }, 50000);
  
});



describe('Event', () => {
        
  beforeAll(async () => {
    
    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertMany([user1, user2, user3, user4]);
    await dbo.collection("events").insertMany([lastEvent1, lastEvent2, lastEvent3, lastEvent4, todayEvent1, todayEvent2, todayEvent3, futureEvent1, futureEvent2, futureEvent3]);
    
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();  
  }, 10000);
     
  afterAll(async () => {
    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
        
    await driver.quit();
  }, 15000);

  afterEach(async () => {
    await driver.get("https://localhost:8080/disconnection");
    
  }, 15000);

  
  test("Last event - owner with description, notes and members", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user3.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser3, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    await driver.get("https://localhost:8080/event.html/" + lastEvent3._id);

    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(lastEvent3.eventName);
    expect(body).toContain("Organisateurice "+ lastEvent3.author.firstName + " " + lastEvent3.author.lastName + " (vous-même)");
    let linkAuthor = await driver.findElement(By.partialLinkText(lastEvent3.author.firstName + " " + lastEvent3.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ lastEvent3.author._id);
    expect(body).toContain("Places " + ((lastEvent3.placesLeft != 0) ? lastEvent3.placesLeft +"/ " + lastEvent3.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + lastEvent3.address);
    expect(body).toContain("Rappel de la description brève");
    expect(body).toContain(lastEvent3.briefDescription);
    expect(body).toContain("Description détaillée");
    expect(body).toContain(lastEvent3.description);
    expect(body).toContain("Remarques");
    expect(body).toContain(lastEvent3.notes);
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).toContain("Participant·e·s");
    for(i = 0; i < lastEvent3.members.length; i++) {
        expect(body).toContain(lastEvent3.members[i].firstName);
        expect(body).toContain(lastEvent3.members[i].lastName);
        expect(body).toContain(lastEvent3.members[i].mail);
        if(lastEvent3.members[i].phone != "") expect(body).toContain(lastEvent3.members[i].phone);
        expect(body).toContain(lastEvent3.members[i].placesRequested);
        let linkUser = await driver.findElement(By.linkText(lastEvent3.members[i].firstName + " " + lastEvent3.members[i].lastName)).getAttribute("href");
        expect(linkUser).toBe("https://localhost:8080/profile.html/"+ lastEvent3.members[i]._id);
      }
  }, 50000);


  test("Last event - participant with description and notes", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user3.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser3, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + lastEvent1._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(lastEvent1.eventName);
    expect(body).toContain("Organisateurice "+ lastEvent1.author.firstName + " " + lastEvent1.author.lastName);
    let linkAuthor = await driver.findElement(By.partialLinkText(lastEvent1.author.firstName + " " + lastEvent1.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ lastEvent1.author._id);
    expect(body).toContain("Places " + ((lastEvent1.placesLeft != 0) ? lastEvent1.placesLeft +"/ " + lastEvent1.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + lastEvent1.address);
    expect(body).toContain("Inscriptions fermées");
    expect(body).toContain("Plus aucune inscription ne peut être réalisée pour cet événement : la date de l'événement est déjà passée.");
    expect(body).toContain("Places réservées " + lastEvent1.members[0].placesRequested);
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(lastEvent1.briefDescription);
    expect(body).toContain("Description détaillée");
    expect(body).toContain(lastEvent1.description);
    expect(body).toContain("Remarques");
    expect(body).toContain(lastEvent1.notes);
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
  
  }, 50000);


  test("Last event - no participating with description and notes", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user2.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser2);
    await driver.findElement(By.css("button")).click();
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + lastEvent1._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(lastEvent1.eventName);
    expect(body).toContain("Organisateurice "+ lastEvent1.author.firstName + " " + lastEvent1.author.lastName);
    expect(body).toContain("Places " + ((lastEvent1.placesLeft != 0) ? lastEvent1.placesLeft +"/ " + lastEvent1.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + lastEvent1.address);
    expect(body).toContain("Inscriptions fermées");
    expect(body).toContain("Plus aucune inscription ne peut être réalisée pour cet événement : la date de l'événement est déjà passée.");
    expect(body).not.toContain("Places réservées");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(lastEvent1.briefDescription);
    expect(body).toContain("Description détaillée");
    expect(body).toContain(lastEvent1.description);
    expect(body).toContain("Remarque");
    expect(body).toContain(lastEvent1.notes);
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
  
  }, 50000);


  test("Last event - owner without description, notes and members", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);
    await driver.findElement(By.css("button")).click();
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + lastEvent2._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(lastEvent2.eventName);
    expect(body).toContain("Organisateurice "+ lastEvent2.author.firstName + " " + lastEvent2.author.lastName);
    expect(body).toContain("Places " + ((lastEvent2.placesLeft != 0) ? lastEvent2.placesLeft +"/ " + lastEvent2.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + lastEvent2.address);
    expect(body).toContain("Rappel de la description brève");
    expect(body).toContain(lastEvent2.briefDescription);
    expect(body).not.toContain("Description détaillée");
    expect(body).not.toContain("Remarques");
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).toContain("Participant·e·s");
    expect(body).toContain("Personne ne s'est inscrit·e à cet événement.");
  }, 50000);


  test("Last event - participant without description and notes", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user3.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser3, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + lastEvent4._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(lastEvent4.eventName);
    expect(body).toContain("Organisateurice "+ lastEvent4.author.firstName + " " + lastEvent4.author.lastName);
    let linkAuthor = await driver.findElement(By.partialLinkText(lastEvent4.author.firstName + " " + lastEvent4.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ lastEvent4.author._id);
    expect(body).toContain("Places " + ((lastEvent4.placesLeft != 0) ? lastEvent4.placesLeft +"/ " + lastEvent4.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + lastEvent4.address);
    expect(body).toContain("Inscriptions fermées");
    expect(body).toContain("Plus aucune inscription ne peut être réalisée pour cet événement : la date de l'événement est déjà passée.");
    expect(body).toContain("Places réservées " + lastEvent4.members[0].placesRequested);
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(lastEvent4.briefDescription);
    expect(body).not.toContain("Description détaillée");
    expect(body).not.toContain("Remarques");
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
  
  }, 50000);


  test("Last event - no participating without description and notes", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user2.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser2);
    await driver.findElement(By.css("button")).click();
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + lastEvent2._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(lastEvent2.eventName);
    expect(body).toContain("Organisateurice "+ lastEvent2.author.firstName + " " + lastEvent2.author.lastName);
    expect(body).toContain("Places " + ((lastEvent2.placesLeft != 0) ? lastEvent2.placesLeft +"/ " + lastEvent2.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + lastEvent2.address);
    expect(body).toContain("Inscriptions fermées");
    expect(body).toContain("Plus aucune inscription ne peut être réalisée pour cet événement : la date de l'événement est déjà passée.");
    expect(body).not.toContain("Places réservées");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(lastEvent2.briefDescription);
    expect(body).not.toContain("Description détaillée");
    expect(body).not.toContain("Remarque");
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
  
  }, 50000);


  test("Today or future event - owner with description, notes and members. Delete", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + futureEvent1._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(futureEvent1.eventName);
    expect(body).toContain("Organisateurice "+ futureEvent1.author.firstName + " " + futureEvent1.author.lastName + " (vous-même)");
    expect(body).toContain("Places " + ((futureEvent1.placesLeft != 0) ? futureEvent1.placesLeft +"/ " + futureEvent1.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + futureEvent1.address);
    expect(body).toContain("Rappel de la description brève");
    expect(body).toContain(futureEvent1.briefDescription);
    expect(body).toContain("Description détaillée");
    expect(body).toContain(futureEvent1.description);
    expect(body).toContain("Remarque");
    expect(body).toContain(futureEvent1.notes);
    expect(body).toContain("Options du·de la créateurice");
    expect(body).toContain("Modifier les informations de l'événement");
    let linkModify = await driver.findElement(By.linkText("Modifier les informations de l'événement")).getAttribute("href");
    expect(linkModify).toBe("https://localhost:8080/editEvent.html/"+ futureEvent1._id);
    expect(body).toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).toContain("Participant·e·s");
    for(i = 0; i < futureEvent1.members.length; i++) {
        expect(body).toContain(futureEvent1.members[i].firstName);
        expect(body).toContain(futureEvent1.members[i].lastName);
        expect(body).toContain(futureEvent1.members[i].mail);
        if(futureEvent1.members[i].phone != "") expect(body).toContain(futureEvent1.members[i].phone);
        expect(body).toContain(futureEvent1.members[i].placesRequested);
        let linkUser = await driver.findElement(By.linkText(futureEvent1.members[i].firstName + " " + futureEvent1.members[i].lastName)).getAttribute("href");
        expect(linkUser).toBe("https://localhost:8080/profile.html/"+ futureEvent1.members[i]._id);
      }
    
    
    let btn = await driver.findElement(By.id("delete_event_button"));
    await driver.executeScript("arguments[0].click();", btn);
    btn = await driver.findElement(By.id("delete_confirmation"));
    await driver.executeScript("arguments[0].click();", btn);
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    eventDeleted = await dbo.collection("events").countDocuments(futureEvent1);
    if(eventDeleted != 0) throw new Error("Event was not deleted");
  
    await dbo.collection("events").insertOne(futureEvent1);
  
  }, 50000);


  test("Today or future event - participant with description and notes and modify inscription", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user3.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser3, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + futureEvent1._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(futureEvent1.eventName);
    expect(body).toContain("Organisateurice "+ futureEvent1.author.firstName + " " + futureEvent1.author.lastName);
    let linkAuthor = await driver.findElement(By.partialLinkText(futureEvent1.author.firstName + " " + futureEvent1.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ futureEvent1.author._id);
    expect(body).toContain("Places " + ((futureEvent1.placesLeft != 0) ? futureEvent1.placesLeft +"/ " + futureEvent1.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + futureEvent1.address);
    expect(body).toContain("Date "+ get_date(futureEvent1.eventDate));
    expect(body).toContain("Places réservées " + futureEvent1.members[0].placesRequested);
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(futureEvent1.briefDescription);
    expect(body).toContain("Description détaillée");
    expect(body).toContain(futureEvent1.description);
    expect(body).toContain("Remarques");
    expect(body).toContain(futureEvent1.notes);
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).toContain("Changer mon choix d'inscription");
    expect(body).toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");

    let btn = await driver.findElement(By.id("change_inscription_button"));
    await driver.executeScript("arguments[0].click();", btn);
    await driver.findElement(By.name("placesRequested")).sendKeys(Key.UP);
    btn = await driver.findElement(By.css("input.button-alike"));
    await driver.executeScript("arguments[0].click();", btn);

    await driver.wait(until.urlIs("https://localhost:8080/event.html/" + futureEvent1._id), 10000);
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain("Places réservées " + (futureEvent1.members[0].placesRequested +1));

    eventModified = await dbo.collection("events").findOne({"_id" : futureEvent1._id});
    expect(eventModified.placesLeft).toBe(futureEvent1.placesLeft - 1);
    expect(eventModified.members[0].placesRequested).toBe(futureEvent1.members[0].placesRequested +1);
    
  }, 50000);


  test("Today or future event - no participant with description and notes and complete", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user4.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser4, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + todayEvent3._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(todayEvent3.eventName);
    expect(body).toContain("Organisateurice "+ todayEvent3.author.firstName + " " + todayEvent3.author.lastName);
    let linkAuthor = await driver.findElement(By.partialLinkText(todayEvent3.author.firstName + " " + todayEvent3.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ todayEvent3.author._id);
    expect(body).toContain("Places " + ((todayEvent3.placesLeft != 0) ? todayEvent3.placesLeft +"/ " + todayEvent3.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + todayEvent3.address);
    expect(body).toContain("Date "+ get_date(todayEvent3.eventDate));
    expect(body).not.toContain("Places réservées");
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(todayEvent3.briefDescription);
    expect(body).toContain("Description détaillée");
    expect(body).toContain(todayEvent3.description);
    expect(body).toContain("Remarques");
    expect(body).toContain(todayEvent3.notes);
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
    expect(body).toContain("Événement complet");
    expect(body).toContain("Plus aucune inscription ne peut être réalisée pour cet événement : toutes les places sont prises.");
  
  }, 50000);


  test("Today or future event - owner without description, notes and members. Delete", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + futureEvent2._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(futureEvent2.eventName);
    expect(body).toContain("Organisateurice "+ futureEvent2.author.firstName + " " + futureEvent2.author.lastName + " (vous-même)");
    expect(body).toContain("Places " + ((futureEvent2.placesLeft != 0) ? futureEvent2.placesLeft +"/ " + futureEvent2.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + futureEvent2.address);
    expect(body).toContain("Rappel de la description brève");
    expect(body).toContain(futureEvent2.briefDescription);
    expect(body).not.toContain("Description détaillée");
    expect(body).not.toContain("Remarque");
    expect(body).toContain("Options du·de la créateurice");
    expect(body).toContain("Modifier les informations de l'événement");
    let linkModify = await driver.findElement(By.linkText("Modifier les informations de l'événement")).getAttribute("href");
    expect(linkModify).toBe("https://localhost:8080/editEvent.html/"+ futureEvent2._id);
    expect(body).toContain("Supprimer l'événement");
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).toContain("Participant·e·s");
    expect(body).toContain("Aucun·e participant·e n'est encore inscrit·e à l'événement");
    
    
    let btn = await driver.findElement(By.id("delete_event_button"));
    await driver.executeScript("arguments[0].click();", btn);
    btn = await driver.findElement(By.id("delete_confirmation"));
    await driver.executeScript("arguments[0].click();", btn);
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    eventDeleted = await dbo.collection("events").countDocuments(futureEvent2);
    if(eventDeleted != 0) throw new Error("Event was not deleted");
  
    await dbo.collection("events").insertOne(futureEvent2);
  
  }, 50000);


  test("Today or future event - participant without description and notes and unsubscribe", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + futureEvent3._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(futureEvent3.eventName);
    expect(body).toContain("Organisateurice "+ futureEvent3.author.firstName + " " + futureEvent3.author.lastName);
    let linkAuthor = await driver.findElement(By.partialLinkText(futureEvent3.author.firstName + " " + futureEvent3.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ futureEvent3.author._id);
    expect(body).toContain("Places " + ((futureEvent3.placesLeft != 0) ? futureEvent3.placesLeft +"/ " + futureEvent3.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + futureEvent3.address);
    expect(body).toContain("Date "+ get_date(futureEvent3.eventDate));
    expect(body).toContain("Places réservées " + futureEvent3.members[0].placesRequested);
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(futureEvent3.briefDescription);
    expect(body).not.toContain("Description détaillée");
    expect(body).not.toContain("Remarques");
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    expect(body).toContain("Changer mon choix d'inscription");
    expect(body).toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
  
    let btn = await driver.findElement(By.id("unsubscribe_button"));
    await driver.executeScript("arguments[0].click();", btn);
    btn = await driver.findElement(By.css("input.button-alike.plain"));
    await driver.executeScript("arguments[0].click();", btn);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
    eventModified = await dbo.collection("events").findOne({"_id" : futureEvent3._id});
    expect(eventModified.placesLeft).toBe(futureEvent3.placesLeft + futureEvent3.members[0].placesRequested);
    expect(eventModified.members.length).toBe(0);

  }, 50000);


  test("Today or future event - no participant without description and notes and inscription", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user4.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser4, Key.ENTER);
  
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  
    await driver.get("https://localhost:8080/event.html/" + todayEvent2._id);
  
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain(todayEvent2.eventName);
    expect(body).toContain("Organisateurice "+ todayEvent2.author.firstName + " " + todayEvent2.author.lastName);
    let linkAuthor = await driver.findElement(By.partialLinkText(todayEvent2.author.firstName + " " + todayEvent2.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ todayEvent2.author._id);
    expect(body).toContain("Places " + ((todayEvent2.placesLeft != 0) ? todayEvent2.placesLeft +"/ " + todayEvent2.places + " place(s) disponible(s)" : "Complet"));
    expect(body).toContain("Lieu " + todayEvent2.address);
    expect(body).toContain("Date "+ get_date(todayEvent2.eventDate));
    expect(body).not.toContain("Places réservées");
    expect(body).not.toContain("Rappel de la description brève");
    expect(body).not.toContain(todayEvent2.briefDescription);
    expect(body).not.toContain("Description détaillée");
    expect(body).not.toContain("Remarques");
    expect(body).not.toContain("Options du·de la créateurice");
    expect(body).not.toContain("Modifier les informations de l'événement");
    expect(body).not.toContain("Supprimer l'événement");
    
    expect(body).not.toContain("Changer mon choix d'inscription");
    expect(body).not.toContain("Se désinscrire");
    expect(body).not.toContain("Participant·e·s");
    
    await driver.findElement(By.name("placesRequested")).sendKeys(Key.UP);
    let btn = await driver.findElement(By.css("input.button-alike"));
    await driver.executeScript("arguments[0].click();", btn);

    await driver.wait(until.urlIs("https://localhost:8080/event.html/" + todayEvent2._id), 10000);
    eventModified = await dbo.collection("events").findOne({"_id" : todayEvent2._id});
    expect(eventModified.placesLeft).toBe(todayEvent2.placesLeft -2);
    expect(eventModified.members[0].firstName).toBe(user4.firstName);
    expect(eventModified.members[0].lastName).toBe(user4.lastName);
    expect(eventModified.members[0].mail).toBe(user4.mail);
    expect(eventModified.members[0].phone).toBe(user4.phone);
    expect(eventModified.members[0].placesRequested).toBe(2);
    body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain("Places réservées 2");
  }, 50000);

});



describe('Edit event', () => {
      
  beforeAll(async () => {
    
    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertMany([user1, user2, user3, user4]);
    await dbo.collection("events").insertMany([lastEvent1, todayEvent2, futureEvent1, futureEvent3]);
    
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();  
    
    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  }, 10000);
     
  afterAll(async () => {
    await driver.get("https://localhost:8080/disconnection");
    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
        
    await driver.quit();
  }, 15000);
    
  
  test("Try to edit an old event", async() => {
    
    await driver.get("https://localhost:8080/editEvent.html/" + lastEvent1._id); 
    
    await driver.wait(until.titleIs("error 404"), 10000);

  }, 50000);


  test("Try to edit an event by a not owner", async() => {
    
    await driver.get("https://localhost:8080/editEvent.html/" + futureEvent3._id); 
    
    await driver.wait(until.titleIs("error 403"), 10000);

  }, 50000);
 

  test("Check initial values (event without description and notes) and modify input without saving", async() => {
    
    await driver.get("https://localhost:8080/editEvent.html/" + todayEvent2._id);

    eventName = await driver.findElement(By.name("eventName")).getAttribute("value");
    briefDescription = await driver.findElement(By.name("briefDescription")).getAttribute("value");
    description = await driver.findElement(By.name("description")).getAttribute("value");
    date = await driver.findElement(By.name("date")).getAttribute("value");
    address = await driver.findElement(By.name("address")).getAttribute("value");
    places = await driver.findElement(By.name("places")).getAttribute("value");
    notes = await driver.findElement(By.name("notes")).getAttribute("value");
    placesRequested = await driver.findElement(By.name("placesRequested")).getAttribute("value");

    expect(eventName).toBe(todayEvent2.eventName);
    expect(briefDescription).toBe(todayEvent2.briefDescription);
    expect(description).toBe(todayEvent2.description);
    expect(new Date(date).toISOString()).toBe(todayEvent2.eventDate.toISOString());
    expect(address).toBe(todayEvent2.address);
    expect(parseInt(places)).toBe(todayEvent2.places);
    expect(notes).toBe(todayEvent2.notes);
    expect(parseInt(placesRequested)).toBe(todayEvent2.places - todayEvent2.placesLeft);

    await driver.findElement(By.name("eventName")).clear();
    await driver.findElement(By.name("eventName")).sendKeys(futureEvent1.eventName);
    await driver.findElement(By.name("briefDescription")).clear();
    await driver.findElement(By.name("briefDescription")).sendKeys(futureEvent1.briefDescription);
    await driver.findElement(By.name("description")).clear();
    await driver.findElement(By.name("description")).sendKeys(futureEvent1.description);
    await driver.findElement(By.name("date")).clear();
    await driver.findElement(By.name("date")).sendKeys(tomorrowDate.getDate() + "-" + (parseInt(tomorrowDate.getMonth())+1) + "-" +tomorrowDate.getFullYear());
    await driver.findElement(By.name("address")).clear();
    await driver.findElement(By.name("address")).sendKeys(futureEvent1.address);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("notes")).clear();
    await driver.findElement(By.name("notes")).sendKeys(futureEvent1.notes);
    

    let btn = await driver.findElement(By.linkText("(retourner sur la page de l'événement sans enregistrer les modifications)"));
    await driver.executeScript("arguments[0].click();", btn);
    await driver.wait(until.urlIs("https://localhost:8080/event.html/" + todayEvent2._id), 10000);

    todayIsModifed = await dbo.collection("events").findOne(todayEvent2);
    if (!todayIsModifed) throw new Error("Today1 is modify or it souldn't");

  }, 50000);


  test("Check initial values(event with description and notes) and edit event", async() => {
    
    await driver.get("https://localhost:8080/editEvent.html/" + futureEvent1._id);

    eventName = await driver.findElement(By.name("eventName")).getAttribute("value");
    briefDescription = await driver.findElement(By.name("briefDescription")).getAttribute("value");
    description = await driver.findElement(By.name("description")).getAttribute("value");
    date = await driver.findElement(By.name("date")).getAttribute("value");
    address = await driver.findElement(By.name("address")).getAttribute("value");
    places = await driver.findElement(By.name("places")).getAttribute("value");
    notes = await driver.findElement(By.name("notes")).getAttribute("value");
    placesRequested = await driver.findElement(By.name("placesRequested")).getAttribute("value");

    expect(eventName).toBe(futureEvent1.eventName);
    expect(briefDescription).toBe(futureEvent1.briefDescription);
    expect(description).toBe(futureEvent1.description);
    expect(new Date(date).toISOString()).toBe(futureEvent1.eventDate.toISOString());
    expect(address).toBe(futureEvent1.address);
    expect(parseInt(places)).toBe(futureEvent1.places);
    expect(notes).toBe(futureEvent1.notes);
    expect(parseInt(placesRequested)).toBe(futureEvent1.places - futureEvent1.placesLeft);

    await driver.findElement(By.name("eventName")).clear();
    await driver.findElement(By.name("eventName")).sendKeys(futureEvent2.eventName);
    await driver.findElement(By.name("briefDescription")).clear();
    await driver.findElement(By.name("briefDescription")).sendKeys(futureEvent2.briefDescription);
    await driver.findElement(By.name("description")).clear();
    await driver.findElement(By.name("description")).sendKeys(futureEvent2.description);
    await driver.findElement(By.name("date")).clear();
    await driver.findElement(By.name("date")).sendKeys(twodayslater.getDate() + "-" + (parseInt(twodayslater.getMonth())+1) + "-" +twodayslater.getFullYear());
    await driver.findElement(By.name("address")).clear();
    await driver.findElement(By.name("address")).sendKeys(futureEvent2.address);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("places")).sendKeys(Key.UP);
    await driver.findElement(By.name("notes")).clear();
    await driver.findElement(By.name("notes")).sendKeys(futureEvent2.notes);
    
    let btn = await driver.findElement(By.css("input.button-alike"));
    await driver.executeScript("arguments[0].click();", btn);

    await driver.wait(until.urlIs("https://localhost:8080/event.html/" + futureEvent1._id), 10000);

    title = await driver.getTitle();
    expect(title).toContain(futureEvent2.eventName);

    futureIsCorrectlyModified = await dbo.collection("events").countDocuments({
      "_id" : futureEvent1._id, 
      "eventName" : futureEvent2.eventName, 
      "author" : futureEvent1.author, 
      "briefDescription" : futureEvent2.briefDescription, 
      "eventDate" : twodayslater, 
      "address" : futureEvent2.address, 
      "places" : futureEvent1.places + 2, 
      "placesLeft" : futureEvent1.placesLeft + 2, 
      "members" : futureEvent1.members, 
      "notes" : futureEvent2.notes
    });
    if (futureIsCorrectlyModified != 1) throw new Error("Future1 was not correctly modified");
  
  }, 50000);
  
});



describe('Search', () => {
  
  beforeAll(async () => {

    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertMany([user1, user3, user4]);
    await dbo.collection("events").insertMany([lastEvent1, futureEvent1, futureEvent2, futureEvent3]);
    await dbo.collection("users").createIndex({"mail" : "text", "lastName" : "text", "firstName" : "text"});
    await dbo.collection("events").createIndex({
      "eventName" : "text",
      "briefDescription" : "text",
      "description" : "text",
      "author.firstName" : "text",
      "author.lastName" : "text",
      "author.mail" : "text",
      "address" : "text"
    });
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1, Key.ENTER);
    
    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);
  }, 10000);
 
  afterAll(async () => {

    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
    
    await driver.quit();
  }, 15000);

  test("Research of a non existing word", async () =>{
    await driver.findElement(By.name("research")).sendKeys("potatoes", Key.ENTER);
    await driver.wait(until.urlIs("https://localhost:8080/search"));

    title = await driver.findElement(By.css("h2")).getText();
    expect(title).toContain("potatoes");

    person = await driver.findElement(By.css("section.search_person")).getText();
    expect(person).toContain("0 personne(s) trouvée(s)");
    expect(person).toContain("Aucun·e utilisateurice n'a été trouvé.");

    events = await driver.findElement(By.css("section.search_events")).getText();
    expect(events).toContain("0 événement(s) trouvé(s)");
    expect(events).toContain("Aucun événement n'a été trouvé.");
  });

  test("Research of user4 (only user found)", async () =>{
    await driver.findElement(By.name("research")).sendKeys("test4", Key.ENTER);
    await driver.wait(until.urlIs("https://localhost:8080/search"));

    title = await driver.findElement(By.css("h2")).getText();
    expect(title).toContain("test4");

    person = await driver.findElement(By.css("section.search_person")).getText();
    expect(person).toContain(user4.firstName + " " + user4.lastName);
    let linkAuthor = await driver.findElement(By.linkText(user4.firstName + " " + user4.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ user4._id);
    
    events = await driver.findElement(By.css("section.search_events")).getText();
    expect(events).toContain("0 événement(s) trouvé(s)");
    expect(events).toContain("Aucun événement n'a été trouvé.");
  });

  test("Research of futureEvent1 (only event found)", async () =>{
    await driver.findElement(By.name("research")).sendKeys("first", Key.ENTER);
    await driver.wait(until.urlIs("https://localhost:8080/search"));

    title = await driver.findElement(By.css("h2")).getText();
    expect(title).toContain("first");

    person = await driver.findElement(By.css("section.search_person")).getText();
    expect(person).toContain("0 personne(s) trouvée(s)");
    expect(person).toContain("Aucun·e utilisateurice n'a été trouvé.");
    
    events = await driver.findElement(By.css("section.search_events")).getText();
    expect(events).toContain(futureEvent1.eventName);
    expect(events).toContain(futureEvent1.author.firstName + " " + futureEvent1.author.lastName);
    expect(events).toContain(futureEvent1.briefDescription);
    expect(events).toContain(get_date(futureEvent1.eventDate));
    expect(events).toContain(((futureEvent1.placesLeft != 0) ? futureEvent1.placesLeft +"/ " + futureEvent1.places + " place(s) disponible(s)" : "Complet"));
    let linkAuthor = await driver.findElement(By.linkText(futureEvent1.author.firstName + " " + futureEvent1.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ futureEvent1.author._id);
    let linkEvent = await driver.findElement(By.linkText(futureEvent1.eventName)).getAttribute("href");
    expect(linkEvent).toBe("https://localhost:8080/event.html/"+ futureEvent1._id);

  });

  test("Research of user1", async () =>{
    await driver.findElement(By.name("research")).sendKeys("test1", Key.ENTER);
    await driver.wait(until.urlIs("https://localhost:8080/search"));

    title = await driver.findElement(By.css("h2")).getText();
    expect(title).toContain("test1");

    person = await driver.findElement(By.css("section.search_person")).getText();
    expect(person).toContain(user1.firstName + " " + user1.lastName);
    linkAuthor = await driver.findElement(By.linkText(user1.firstName + " " + user1.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ user1._id);

    events = await driver.findElement(By.css("section.search_events")).getText();
    expect(events).toContain(futureEvent1.eventName);
    expect(events).toContain(futureEvent1.author.firstName + " " + futureEvent1.author.lastName);
    expect(events).toContain(futureEvent1.briefDescription);
    expect(events).toContain(get_date(futureEvent1.eventDate));
    expect(events).toContain(((futureEvent1.placesLeft != 0) ? futureEvent1.placesLeft +"/ " + futureEvent1.places + " place(s) disponible(s)" : "Complet"));
    linkAuthor = await driver.findElement(By.linkText(futureEvent1.author.firstName + " " + futureEvent1.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ futureEvent1.author._id);
    linkEvent = await driver.findElement(By.linkText(futureEvent1.eventName)).getAttribute("href");
    expect(linkEvent).toBe("https://localhost:8080/event.html/"+ futureEvent1._id);
    expect(events).toContain(futureEvent2.eventName);
    expect(events).toContain(futureEvent2.author.firstName + " " + futureEvent2.author.lastName);
    expect(events).toContain(futureEvent2.briefDescription);
    expect(events).toContain(get_date(futureEvent2.eventDate));
    expect(events).toContain(((futureEvent2.placesLeft != 0) ? futureEvent2.placesLeft +"/ " + futureEvent2.places + " place(s) disponible(s)" : "Complet"));
    linkAuthor = await driver.findElement(By.linkText(futureEvent2.author.firstName + " " + futureEvent2.author.lastName)).getAttribute("href");
    expect(linkAuthor).toBe("https://localhost:8080/profile.html/"+ futureEvent2.author._id);
    linkEvent = await driver.findElement(By.linkText(futureEvent2.eventName)).getAttribute("href");
    expect(linkEvent).toBe("https://localhost:8080/event.html/"+ futureEvent2._id);
    expect(events).not.toContain(lastEvent1.eventName);
  });

});



describe('Check the response of nonexisting page', () => {
      
  beforeAll(async () => {

    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.createCollection("users");
    await dbo.collection("users").insertOne(user1);
   
    const capabilities = Capabilities.chrome();
    capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);   
    driver = new Builder().withCapabilities(capabilities).forBrowser("chrome").build();
  }, 10000);
 
  afterAll(async () => {

    await driver.get("https://localhost:8080/disconnection");

    await dbo.collection("users").drop();
    await dbo.collection("saveUsers").rename("users");
    await connection.close();
    
    await driver.quit();
  }, 15000);
  

  test("User not connected", async() => {

    listUrl = {
      0 : "https://localhost:8080/event.html/", 
      1 : "https://localhost:8080/editEvent.html/",
      2 : "https://localhost:8080/profile.html/",
      3 : "https://localhost:8080/main.html",
      4 : "https://localhost:8080/searchResult.html",
      5 : "https://localhost:8080/test"
    };

    for (var URL in listUrl){
      await driver.get(`${listUrl[URL]}`);
      title = await driver.getTitle();
      expect(title).toBe("error 404");
    };

  }, 50000);


  test("User connected", async() => {

    await driver.get("https://localhost:8080/login.html");
    await driver.findElement(By.name("mail")).sendKeys(user1.mail);
    await driver.findElement(By.name("password")).sendKeys(passwordUser1);
    await driver.findElement(By.css("button")).click();

    await driver.wait(until.urlIs("https://localhost:8080/"), 10000);

    listUrl = {
      0 : "https://localhost:8080/event.html", 
      1 : "https://localhost:8080/event.html/0000000000", 
      2 : "https://localhost:8080/editEvent.html",
      3 : "https://localhost:8080/editEvent.html/0000000000",
      4 : "https://localhost:8080/profile.html",
      5 : "https://localhost:8080/profile.html/0000000000",
      6 : "https://localhost:8080/main.html",
      7 : "https://localhost:8080/searchResult.html",
      8 : "https://localhost:8080/test"
    };

    for (var URL in listUrl){
      await driver.get(`${listUrl[URL]}`);
      title = await driver.getTitle();
      expect(title).toBe("error 404");
    };
  }, 50000);

});


describe('Security', () => {
    
  beforeAll(async () => {

    connection = await MongoClient.connect('mongodb://localhost:27017',  { useUnifiedTopology: true });
    dbo = connection.db("calendar");
    await dbo.collection("users").rename("saveUsers");
    await dbo.collection("events").rename("saveEvents");
    await dbo.createCollection("users");
    await dbo.createCollection("events");
    await dbo.collection("users").insertMany([user1, user2, user3]);
    await dbo.collection("events").insertMany([lastEvent1, futureEvent1]);

  }, 10000);
 
  afterAll(async () => {

    await dbo.collection("users").drop();
    await dbo.collection("events").drop();
    await dbo.collection("saveUsers").rename("users");
    await dbo.collection("saveEvents").rename("events");
    await connection.close();
    
  }, 15000);


  test("error 401 editPassword (not connected)", async () => {

    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/editPassword')
      .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
      .strictSSL(false)
      .send('oldPassword=' + passwordUser1)
      .send('newPassword=' + passwordUser2)
      .send('passwordCheck=' + passwordUser2)
      
    expect(res.status).toBe(401);

    var registerUser = await dbo.collection("users").countDocuments({$or : [user1, user2, user3]});
    expect(registerUser).toBe(3);

  }, 50000);


  
  test("error 401 updateProfile (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/updateProfile')
      .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
      .strictSSL(false)
      .send('lastName=test')
      .send('firstName=test')
      .send('phone=2222')
      .send('mail=test1@test1')
      .send('password=' + passwordUser1)
    
    expect(res.status).toBe(401);
     
    var registerUser = await dbo.collection("users").countDocuments({$or : [user1, user2, user3]});
    expect(registerUser).toBe(3);

  }, 50000);


  test("error 401 createEvent (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)
    
    res = await unirest('POST', 'https://localhost:8080/createEvent')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)
    .send('eventName=test')
    .send('briefDescription=test')
    .send('date=12-12-2050')
    .send('address=test')
    .send('places=1')
    .send('description=test')
    .send('notes=test')
  
  expect(res.status).toBe(401);
  
  var events = await dbo.collection("events").countDocuments();
  expect(events).toBe(2);

  }, 50000);


  test("error 403 updateEvent (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/updateEvent/5fdf2011098b4b68db5060df')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('eventName=new value')
        .send('briefDescription=test')
        .send('date=12-12-2050')
        .send('address=test')
        .send('places=1')
        .send('description=test')
        .send('notes=test')
    
    expect(res.status).toBe(403);

    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);


  
  test("error 403 updateEvent (connected but not owner)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test2@test2')
        .send('password=test2')
      
    res = await unirest('POST', 'https://localhost:8080/updateEvent/5fdf2011098b4b68db5060df')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('eventName=new value')
        .send('briefDescription=test')
        .send('date=12-12-2050')
        .send('address=test')
        .send('places=1')
        .send('description=test')
        .send('notes=test')
    
    expect(res.status).toBe(403);    
    expect(res.raw_body).toContain("test2");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 403 updateEvent (owner but last event)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test1@test1')
        .send('password=test1')

    res = await unirest('POST', 'https://localhost:8080/updateEvent/5fdf1fdf8cda56d48bbde9cf')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
        })
        .strictSSL(false)
        .send('eventName=new value')
        .send('briefDescription=test')
        .send('date=12-12-2050')
        .send('address=test')
        .send('places=1')
        .send('description=test')
        .send('notes=test')
    
    expect(res.status).toBe(403);
    expect(res.raw_body).toContain("test1");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);


  test("error 403 eventDeletion (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/eventDeletion/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)

    expect(res.status).toBe(403);
    
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);


  
  test("error 403 eventDeletion (connected but not owner)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test2@test2')
        .send('password=test2')
    
    res = await unirest('POST', 'https://localhost:8080/eventDeletion/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)

    expect(res.status).toBe(403);
    
    expect(res.raw_body).toContain("test2");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 403 eventDeletion (owner but last event)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test1@test1')
        .send('password=test1')
    
    res = await unirest('POST', 'https://localhost:8080/eventDeletion/5fdf1fdf8cda56d48bbde9cf')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)

    expect(res.status).toBe(403);
    expect(res.raw_body).toContain("test1");

    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);



  test("error 401 eventInscription (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/eventInscription/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .send('placesRequested=2')
    .strictSSL(false)

    expect(res.status).toBe(401);
    
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 403 eventInscription (connected but last event)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test2@test2')
        .send('password=test2')
    
    res = await unirest('POST', 'https://localhost:8080/eventInscription/5fdf1fdf8cda56d48bbde9cf')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .send('placesRequested=2')
    .strictSSL(false)

    expect(res.status).toBe(403);
    
    expect(res.raw_body).toContain("test2");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 401 eventModificationInscription (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/eventModificationInscription/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .send('placesRequested=2')
    .strictSSL(false)

    expect(res.status).toBe(401);
    
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 403 eventModificationInscription (connected but not inscribe)", async() => {

    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test2@test2')
        .send('password=test2')

    res = await unirest('POST', 'https://localhost:8080/eventModificationInscription/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)
    .send('placesRequested=2')

    expect(res.status).toBe(403);
    expect(res.raw_body).toContain("test2");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);


  test("error 403 eventModificationInscription (connected but last event)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test3@test3')
        .send('password=test3')
    
    res = await unirest('POST', 'https://localhost:8080/eventModificationInscription/5fdf1fdf8cda56d48bbde9cf')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .send('placesRequested=2')
    .strictSSL(false)

    expect(res.status).toBe(403);
    expect(res.raw_body).toContain("test3")
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);


  test("error 401 eventUnsubscribe (not connected)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    res = await unirest('POST', 'https://localhost:8080/eventUnsubscribe/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)
    .send('placesRequested=2')
  

    expect(res.status).toBe(401);
    
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 403 eventUnsubscribe (connected but not inscribe)", async() => {

    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test2@test2')
        .send('password=test2')

    res = await unirest('POST', 'https://localhost:8080/eventUnsubscribe/5fdf2011098b4b68db5060df')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .strictSSL(false)
    .send('placesRequested=2')

    expect(res.status).toBe(403);
    expect(res.raw_body).toContain("test2");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

  
  test("error 403 eventUnsubscribe (connected but last event)", async() => {
    res = await unirest('GET', 'https://localhost:8080/')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    .strictSSL(false)

    await unirest
        .post('https://localhost:8080/login')
        .headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': "connect.sid=" + res.cookies["connect.sid"]
      })
        .strictSSL(false)
        .send('mail=test3@test3')
        .send('password=test3')

    res = await unirest('POST', 'https://localhost:8080/eventUnsubscribe/5fdf1fdf8cda56d48bbde9cf')
    .headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': "connect.sid=" + res.cookies["connect.sid"]
    })
    .send('placesRequested=2')
    .strictSSL(false)

    expect(res.status).toBe(403);
    expect(res.raw_body).toContain("test3");
    var events = await dbo.collection("events").countDocuments({$or : [lastEvent1, futureEvent1]});
    expect(events).toBe(2);

  }, 50000);

});
