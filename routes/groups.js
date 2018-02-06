
var express = require('express');
var router = express.Router();
var Group = require('../models/groups')

//example referenced
//https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
router.get('/', function(req, res, next) {
    var perPage = 10
    var page = req.query.page || 1

    Group.find({})
        .skip((page -1) * perPage )
        .limit(perPage)
        .sort([['updateDate', -1]])
        .exec(function(err, results) {
            Group.count().exec(
                function(err, count) {
                    console.log(results)
                    console.log(count)
                    res.json({error_code:0, data:results, total:count})
                }
            )            
        })
});

router.get('/:id', function(req, res, next) {
    Group.find({_id: req.params.id})
        .exec(function(err, results) {
            console.log(results)
            res.json(results)
        })
});

router.post('/', function(req, res, next) {
    delete req.body._id
    var group = new Group(req.body)
    group.users = []
    group.createDate = new Date();
    group.updateDate = new Date();
    console.log(req.body)    

    console.log(group)
    group.save(function(err) {
        if (err) throw err
        res.json({error_code:0, _id: group._id})
    })
});

router.put('/:id', function(req, res, next) {
    var group = new Group(req.body)
    group.updateDate = new Date();
    console.log(req.body)
    console.log(group)

    Group.findOneAndUpdate({ _id:  req.params.id }, group,  function (err) {
        if (err) throw err
        res.json({error_code:0, _id: group._id})
      });
});


router.delete('/:id', function(req, res, next) {
    Group.remove({ _id:  req.params.id }, function (err) {
        if (err) throw err
        res.json({error_code:0})
      });
});


module.exports = router;
