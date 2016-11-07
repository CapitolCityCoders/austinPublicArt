var express = require('express');
var router = express.Router();
var fetch = require('isomorphic-fetch');
var secret = require('../../secret');

module.exports = router;

router.get('/:address', function(req, res) {
	var address = req.params.address
	if (address) {
		fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address},+Austin,+TX&key=${secret}`)
			.then(data => data.json() )
			.then( data => {
				res.send(data)
			})
			.catch( err => console.log(err))
	} else {
		res.sendStatus(500)
	}
})

