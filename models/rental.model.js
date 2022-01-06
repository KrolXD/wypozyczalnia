const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/rental");
autoIncrement.initialize(connection);

var rentSchema = new mongoose.Schema({
    filmData: {
        film_id:{},
        filmId:{},
        title:{}
    },
    customerData: {
        customer_id:{},
        customerId:{},
        name:{},
        lastName:{}
    },
    dateOfRental: {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000)
    },
    date_of_planned_return: {
        type: Date,
        default: () => new Date(+new Date() + 9*24*60*60*1000)
    },
    date_of_actual_return: {
        type: Date,
    }
}, { minimize: false });

rentSchema.plugin(autoIncrement.plugin, { model: 'Rental', field: 'rentId' });

mongoose.model('Rent', rentSchema);