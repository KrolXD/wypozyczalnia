const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/rental");
autoIncrement.initialize(connection);

var customerSchema = new mongoose.Schema({
    user_id:
    {},
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    dateOfRegistration: {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000)
    },
    activeRentals: {
        type: Number,
        default: 0
    }
});

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique : true
    },
    password: {
        type: String
    },
    admin: {
        type: Number,
        default: 0
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    dateOfRegistration: {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000)
    }
});

customerSchema.plugin(autoIncrement.plugin, { model: 'Customers', field: 'customerId' });

mongoose.model('Customers', customerSchema);
mongoose.model('User', userSchema);