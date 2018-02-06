
var express = require('express');
var router = express.Router();
var Group = require('../models/groups')
var userService = require('../services/user.service');
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


router.get('/nearby', (req,res,next) => {
    console.log(req);
    let lng = req.query.lng;
    let lat = req.query.lat;
    console.log(lng);
    Group.find({geolocation: {$near:[lng,lat]}}).limit(10).then((data)=>{     
        res.status(200).json(data);
    }).catch((err) => {
        console.log(err)
    });
})


router.post('/join', (req,res,next) => {
    if (req.headers && req.headers.authorization) {
        userService.getByJWT(req.headers.authorization.replace(/^Bearer\s/, ''))
            .then(function (user) {
                //join query
                console.log(user);
                var userObj = {
                    name: user.name,
                    joinDate: new Date()
                }
                Group.findOneAndUpdate({ _id:  req.body.id },{$push :{users: userObj} },  function (err,data) {
                    if (err) throw err
                    console.log("test");
                    res.json({data: data , error_code:0})
                  });
            })
            .catch(function (err) {
                res.status(500).send({error_code:1, msg:err});
            });
    } else {
        res.status(400).send({error_code:1, msg:"Not authorized!"});
    }
});

router.post('/leave', (req,res,next) => {
    if (req.headers && req.headers.authorization) {
        userService.getByJWT(req.headers.authorization.replace(/^Bearer\s/, ''))
            .then(function (user) {
                //leave query
                Group.findOneAndUpdate({ _id:  req.body.id },{$pull :{users: {name: user.name}} },  function (err,data) {
                    if (err) throw err
                    console.log("test");
                    res.json({data: data , error_code:0})
                  });
            })
            .catch(function (err) {
                res.status(500).send({error_code:1, msg:err});
            });
    } else {
        res.status(400).send({error_code:1, msg:"Not authorized!"});
    }
});

router.post('/registered', (req,res,next) => {
    if (req.headers && req.headers.authorization) {
        userService.getByJWT(req.headers.authorization.replace(/^Bearer\s/, ''))
            .then(function (user) {
                //get registered groups by user.
                Group.find({users: {$elemMatch: {name : user.name}}}).then((data)=>{     
                    res.status(200).json(data);
                });
            })
            .catch(function (err) {
                res.status(400).send({error_code:1, msg:err});
            });
    } else {
        res.status(400).send({error_code:1, msg:"Not authorized!"});
    }
});


module.exports = router;
