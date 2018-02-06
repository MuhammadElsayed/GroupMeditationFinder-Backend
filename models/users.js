var mongoose = require('mongoose');
var config = require('../config.json');

mongoose.connect(config.connectionString);

var location = new mongoose.Schema({
    type: String,
    coordinates: [Number]
});

var openID = new mongoose.Schema({
    provider: String,
    token: String,
    id: String

});

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    role: String,
    openID: openID,
    location: location
});

userSchema.index({email: 1});
userSchema.index({email: 1});

module.exports = mongoose.model('User', userSchema, 'users');