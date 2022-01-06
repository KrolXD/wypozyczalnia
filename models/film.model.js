const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/rental");
autoIncrement.initialize(connection);

var filmSchema = new mongoose.Schema({
    tytul: {
        type: String
    },
    rezyser: {
        type: [String]
    },
    gatunek: {
        type: [String]
    },
    aktorzy: {
        type: [String]
    },
    opis: {
        type: String
    },
    dataDodania: {
        type: Date,
    },
    ocena: {
        type: Number,
        min: 1,
        max: 10
    },
    czas: {
        type: Number
    },
    dostepnosc:{
        type: Boolean
    }
});

filmSchema.plugin(autoIncrement.plugin, { model: 'Films', field: 'filmId' });

mongoose.model('Films', filmSchema);