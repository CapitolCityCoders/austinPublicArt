let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

var express = require('express');
let session = require('express-session');

var Auth = require('../models/auth');
var utils = require('../utils');



module.exports = function (passport) {
//---------------Serialize-----------------//
//-----------------------------------------//
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    });
  });

// Remember:
 // If enabled, be sure to use express.session() before passport.session()
 // to ensure that the login session is restored in the correct order.

  //---------------Strategies----------------//
  //-----------------------------------------//
  passport.user('local-signup', new LocalStrategy(
    function(username, password, done) {
      Auth.getUser({username: username})
        .then(user => {
          if (user[0]) {
            return done(null, false, req.flash('signupMessage', 'That username is taken!'))
          } else {
            return Auth.signUp(username, password)
            .then(user => {
              return Auth.createSession(user._id)
            })
            .then(function(obj) {
              return done(null, {userID:obj})
            })
          }
        })
    }
  )
};
            // continue to handle sessions like austinArt initially did,
            // like below, but consider using express-session instead
        // .then(sesion => {
        //   res.send(JSON.stringify(session.sessionId));
        // })






//   passport.user('local-signup', new LocalStrategy(
//     function(username, password, done) {
//       // db.collection('users').find({users obj}).then.....
//       // if it's already there, error
//       // hash pass
//       // create session

//       // Add util function for error handling
//       // Take care of generating a session either with
//         // express-session or with Auth.createSession(user....)
//       Auth.getUser({username: username})
//         .then(user => {
//           if (user[0]) {
//             return done(null, false, req.flash('signupMessage', 'That username is taken!'))
//           } else {
//             return Auth.signUp(username, password)
//           }
//         })
//         .then(user => {
//             // continue to handle sessions like austinArt initially did,
//             // like below, but consider using express-session instead
//           return Auth.createSession(user._id)
//         })
//         .then(sesion => {
//           res.send(JSON.stringify(session.sessionId));
//         })
//   ))};


// // keep all the stuff in models/auth.js
// // get rid of most of equivlent functions in controller/auth.js


//     User.findOne({'local.username': email}, function(err, user){
//       if(err)
//         return done(err);
//       if(user) {
//         return done(null, false, req.flash('signupMessage', 'That email.,sdma.d'))
//       } else {
//         van newUser = new User();

//         newUser.local.username = email;
//         newUser.local.password = newUser.generaateHash(password);

//         newUser.save(function(err){
//           if(err)
//             throw err;
//           return done(null, newUser);
//         })
//       }
//     })
//   }));

//   passport.user('local-login', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
//   },
//   function(req, email, password, done){
//     process.nextTick(function(){
//       User.findOne({'local.username': email}, function(err, user){
//         if(err)
//           return done(err);
//         if(!user)
//           return done(null, false, req.flash('loginMessage', 'No user sdjfnskdn'))
//         if(!user.validPassword(password)){
//           return done(null, false, req.flash('loginMessage', 'Not real password asnjn'))
//         }
//         return done(null, user);
//       });
//     });
//   }));

// };