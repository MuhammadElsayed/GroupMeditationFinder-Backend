
var express = require('express');
var router = express.Router();
var Group = require('../models/groups')

//example referenced
//https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
router.get('/', function(req, res, next) {
    var perPage = 10
    var page = req.params.page || 1

    Group.find({})
        .skip((page -1) * perPage )
        .limit(perPage)
        .exec(function(err, results) {
        console.log(results)
            res.json(results)
        })
});

router.post('/', function(req, res, next) {
    var group = new Group()
    console.log(req.body)
    group.name = req.body.name
    group.description = req.body.description
    group.datetime = req.body.datetime
    group.address = req.body.address
    group.geolocation = [req.body.lng, req.body.lat ]

    console.log(group)
    group.save(function(err) {
        if (err) throw err
        res.json({error_code:0})
    })
});

router.put('/:id', function(req, res, next) {
    var group = {}
    console.log(req.body)
    group.name = req.body.name
    group.description = req.body.description
    group.datetime = req.body.datetime
    group.address = req.body.address
    group.geolocation = [req.body.lng, req.body.lat ]

    Group.findOneAndUpdate({ _id:  req.params.id },group,  function (err) {
        if (err) throw err
        // removed!
        res.json({error_code:0})
      });
});


router.delete('/:id', function(req, res, next) {
    Group.remove({ _id:  req.params.id }, function (err) {
        if (err) throw err
        // removed!
        res.json({error_code:0})
      });
});


module.exports = router;
