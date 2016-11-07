var express = require('express');
var router = express.Router();
var Art = require('../models/art');

module.exports = router;

router.use('/auth', require('./auth'));
router.use('/favorite', require('./favorite'));
router.use('/like', require('./like'));
router.use('/coordinates', require('./coordinates'));

// client asking for art data
router.get('/art', function(req, res) {
  //retrieve all art from db
  Art.get()
    .then(art => {
      res.send(art);
    })
})
