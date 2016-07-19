var express    = require('express');
var path       = require('path');
var browserify = require("browserify-middleware");
var bodyParser = require('body-parser');
var history    = require('connect-history-api-fallback');

var Utils      = require(path.join(__dirname, './utils.js'));
var db         = require(path.join(__dirname, './db.js'));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app        = express();



// client asking for art data
app.get('/art', function(req,res) {
  //retrieve all art from db
  db.art.find()
  .then((art) => {
    res.send(art)
  })
})

app.post('/signUp', function(req, res) {
 var username = req.body.username;
 var password = req.body.password;

 db.collection('users').find({username: username})
 .then((user) => {
   if(user[0]){
     res.statusMessage = "Username taken."
     res.status(400).end();
   } else {
     return Utils.hashPassword(password)
   }
 })
 .then(function(hash){
   return db.collection('users').insert({username: username, password: hash});
 })
 .then(function(obj){
   var sessionId = Utils.createSessionId();
   return db.collection('sessions').insert({id: obj._id, sessionId: sessionId});
 })
 .then(function(obj){
   res.send(JSON.stringify(obj.sessionId));
 })
})



// Logs in current user as long as username is in users collection and provided a valid password
app.post('/login', function(req, res) {
 var username = req.body.username;
 var password = req.body.password;
 var userID;
  db.collection('users')
    .find({username: username})
    .then((userObj) => {
      if(!userObj[0]) {
        res.statusMessage = "Incorrect username or password"
        res.status(400).end();
      } else {
        userID = userObj[0]._id;
        return Utils.comparePassword(userObj[0].password, password)
      }
    })
    .then((isValidPassword) => {
      if(!isValidPassword) {
        res.statusMessage = "Incorrect username or password"
        res.status(401).end();
      } else {
        return db.collection('sessions')
          .insert({ id: userID, sessionId: Utils.createSessionId() })
      }
    })
    .then((userObj) => {
      res.send(JSON.stringify(userObj.sessionId))
    })
})

// Retrieve all favorited art for the current logged in user
app.get('/favorites', function(req, res) {
	var sessionId;

  if(req.headers.cookieheader) {
		sessionId = req.headers.cookieheader.substring(10);
	} else {
		res.sendStatus(401);
	}
	// Find the sessionId in sessions collection
	db.collection('sessions')
	.find({ sessionId: sessionId })
	// Grab the user id from the sessions collection
	.then((returnedSession) => returnedSession[0].id)
	// Find all documents in favorites that contain the users id
	.then((userID) => db.collection('favorites')
		.find({ userId: userID }))
	// Return all favorited art back to client
	.then((returnedFavorites) => res.send(returnedFavorites))
})

app.get('/user', function(req, res) {
  var sessionId;

  if(req.headers.cookieheader) {
    sessionId = req.headers.cookieheader.substring(10);
  } else {
    res.sendStatus(401);
  }
  // Find the sessionId in sessions collection
  db.collection('sessions')
  .find({ sessionId: sessionId })
  // Grab the user id from the sessions collection
  .then((returnedSession) => res.send(returnedSession[0].id))
})

app.get('/username', function(req, res) {
  var sessionId;

  if(req.headers.cookieheader) {
    sessionId = req.headers.cookieheader.substring(10);
    // Find the sessionId in sessions collection
    db.collection('sessions')
    .find({ sessionId: sessionId })
    // User session id to grab user
    .then((returnedSession) => db.collection('users').find({ _id: returnedSession[0].id }))
    // Send back just the username to client
    .then((user) => res.send(JSON.stringify(user[0].username)))
  } else {
    res.sendStatus(401);
  }
})

// Will add a favorite with userId and artId to the favorites collection if not already present.
// If it is present it will remove the userId and artId from favorites collection
app.post('/favorites/:artId', function(req, res) {
  var artId = req.params.artId;
  var sessionId = req.body.cookie.substring(10);
  var userID = '';

  // Checks to see if user has a cookie.
  //  True : assign cookie to sessionID
  //  False: send a 401("Forbidden") status back to client
  if(!sessionId) {
    res.sendStatus(401)
  }

  // Finds the users session object using sessionId from cookie
  db.collection('sessions')
    .find({sessionId: sessionId})
    .then((returnedSession) => userID = returnedSession[0].id)
    .then(() => {
      //Check to see if the user has already favorited the artwork
      return db.collection('favorites').find({
        $and : [
        { userId: { $eq: userID } },
        { artId : { $eq: artId } } ]
      })
    .then((isEqual) => {
      // Checks to see if user has already favorited :artId
      // False: add userId and artId to favorites collection
      if(!isEqual[0]) {
        db.collection('favorites')
        .insert({ userId: userID, artId: artId })
        res.send({Status: "Successfully added to favorites"})
      } else {
        // True: remove userId and artId from favorites collection
        db.collection('favorites')
        .find({ userId: userID, artId: artId })
        .then((returnedDocument) => {
          db.collection('favorites')
          .remove({ _id: returnedDocument[0]._id })
          res.send({Status: "Successfully removed from favorites"})
        })
      }
    })
  })
})

app.post('/like/:id', function(req, res){
  var artId = req.params.id;
  var sessionId = req.body.cookie.substring(10);
  var userId;

  if(!sessionId){
    res.sendStatus(401)
  } else {
    db.collection('sessions').find({ sessionId: sessionId })
    .then((users) => {
      // Get user id from session
      userId = users[0].id;
      return db.collection('users').find({ _id: userId })
    })
    .then((users) => {
      // Check if user exists
      if(users[0]){
        return db.collection('likes').find({ userId: userId, artId: artId })
      } else {
        // User doesn't exist, send back -bad request-
        res.sendStatus(400)
      }
    })
    .then((likes) => {
      // Check if user has already liked the art
        if(likes[0]){
          // if so then the user will unlike the art
          return db.collection('likes').remove({ userId: userId, artId: artId })
        } else {
          // if not then the user will like the art
          return db.collection('likes').insert({ userId: userId, artId: artId })
        }

    })
    .then((result) => {
      res.send({ "Status": "Success" })
    })
  }
})

app.get('/likes/:id', function(req, res){
  var artId = req.params.id;

  if(!artId){
    res.status(400).send({"Error": "No art id... Come on now"})
  } else {
    db.collection("likes").find({ artId: artId })
    .then((likes) => {
      res.send({ likeCount: likes.map((x) =>  x.userId) })
    })
  }
})

app.use(history());
app.use(express.static(path.join(__dirname, "../client/public")));

app.get('/app-bundle.js',
browserify(path.join(__dirname, '../client/main.js'), {
   transform: [ [ require('babelify'), { presets: ["es2015", "react"] } ] ]
 })
);

// Run server on port 4040
var port = process.env.PORT || 4040;

app.listen(port)
console.log("Server is listening on port " + port)
