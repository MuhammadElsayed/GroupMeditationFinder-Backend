var mongoose = require('mongoose')

mongoose.connect('mongodb://mwa-user:mwa-pass@54.209.64.120:27017/mwa_db');


//http://mongoosejs.com/docs/api.html

var groupSchema = new mongoose.Schema({  
  name: String,
  description: String,
  datetime: Date,
  address: {
    street: String,
    city: String,
    state: String
  },
  geolocation:[Number],
  users: [{
    name: String,
    joinDate: Date
  }]
});

groupSchema.index({geolocation: '2d'});
// groupSchema.pre('save',(next) => {
//     var currentDate = new Date();
//     this.
// })

module.exports = mongoose.model('Group', groupSchema, 'groups')
