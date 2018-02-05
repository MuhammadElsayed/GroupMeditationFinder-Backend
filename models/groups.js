var mongoose = require('mongoose')

mongoose.connect('mongodb://mwa-user:mwa-pass@54.209.64.120:27017/mwa_db');


//http://mongoosejs.com/docs/api.html

var groupSchema = new mongoose.Schema({  
  name: String,
  description: String,
  datetime: Date,
  address: String,
  geolocation:[Number],
  users: [String]
})

module.exports = mongoose.model('Group', groupSchema, 'groups')
