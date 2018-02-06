var mongoose = require('mongoose')
var config = require('../config.json');

mongoose.connect(config.connectionString);


//http://mongoosejs.com/docs/api.html

var groupSchema = new mongoose.Schema({  
  name: String,
  description: String,
  datetime: Date,
  address: {
    street: String,
    city : String,
    state : String,
  },
  geolocation:[Number],
  users: [{
    name: String,
    joinDate: Date
  }],
  isEveryday : Boolean,
  createDate: Date,
  updateDate: Date,
}, {
  versionKey: false // You should be aware of the outcome after set to false
});
groupSchema.index({geolocation: '2d'});

module.exports = mongoose.model('Group', groupSchema, 'groups')
