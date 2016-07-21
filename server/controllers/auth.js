var express = require('express');
var Auth = require('../models/auth');
var utils = require('../utils');
var passportFile = require('./passport');

let passport = require('passport');

var router = express.Router();

router.use(passport.initialize());

//require('./passport')(passport);


module.exports = router;


router.post('/signUp',
  passport.authenticate('local',
    {successRedirect: '/',
     failureRedirect: '/',
     failureFlash: false
    })
);
  // function(req, res){
  // console.log('req.user ' , req.user);
  // console.log('req.sessionId', req.sessionId)

  // { successRedirect: '/',
  //   failureRedirect: '/login',
  //   failureFlash: true }

   // res.send(JSON.stringify(obj.sessionId));

  // function(req, res) {
    // const username = req.body.username;
    // const password = req.body.password;

  // Auth.getUser(username)
  // .then(user => {
  //   if(user[0]){
  //     res.statusMessage = "Username taken."
  //     res.status(400).end();
  //   } else {
  //     return Auth.signUp(username, password);
  //   }
  // })
  // .then(user =>
  //   Auth.createSession(user._id)
  // )
  // .then(session => {
  // res.send(JSON.stringify(res.user.sessionId));
  // })

// }


// app.post('/signUp', passport.authenticate('local-signup'), function(req, res) {
 // db.collection('users').find({username: username})
 // .then((user) => {
 //   if(user[0]){
 //     res.statusMessage = "Username taken."
 //     res.status(400).end();
 //   } else {
 //     return Utils.hashPassword(password)
 //   }
 // })
 // .then(function(hash){
 //   return db.collection('users').insert({username: username, password: hash});
 // })
 // .then(function(obj){
 //   var sessionId = Utils.createSessionId();
 //   return db.collection('sessions').insert({id: obj._id, sessionId: sessionId});
 // })
 // .then(function(obj){
 //   res.send(JSON.stringify(obj.sessionId));
 // })


// Logs in current user as long as username is in users collection and provided a valid password
router.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let userId;

  Auth.getUser(username)
    .then(user => {
      if(!user[0]) {
        res.statusMessage = "Incorrect username or password"
        res.status(400).end();
      } else {
        userId = user[0]._id;
        return utils.comparePassword(user[0].password, password)
      }
    })
    .then(isValidPassword => {
      if(!isValidPassword) {
        res.statusMessage = "Incorrect username or password"
        res.status(401).end();
      } else {
        return Auth.createSession(userId)
      }
    })
    .then(session => {
      res.send(JSON.stringify(session.sessionId))
    })
})

router.get('/user', function(req, res) {
  var sessionId;

  if(req.headers.cookieheader) {
    sessionId = req.headers.cookieheader.substring(10);
  } else {
    res.sendStatus(401);
  }
  // Find the sessionId in sessions collection
  Auth.getSession(sessionId)
     // Grab the user id from the sessions collection
    .then(session => {
      res.send(session[0].id)
    })
})

router.get('/username', function(req, res) {
  var sessionId;

  if(req.headers.cookieheader) {
    sessionId = req.headers.cookieheader.substring(10);
  } else {
    res.sendStatus(401);
  }
  // Find the sessionId in sessions collection
  Auth.getSession(sessionId)
    // Grab the user id from the sessions collection
    .then(session =>
      Auth.getUserById(session[0].id)
    )
    // Send back just the username to client
    .then(user => {
      res.send(JSON.stringify(user[0].username))
    })
})
