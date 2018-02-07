var mongoose = require('mongoose');
var config = require('../config.json');

mongoose.connect(config.connectionString);


var adminKeySchema = new mongoose.Schema({
    key: String
});

adminKeySchema.index({key: 1});

module.exports = mongoose.model('AdminKey', adminKeySchema, 'adminkeys');