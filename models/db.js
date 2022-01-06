const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://KrolXD:asdZXC99885@cluster0.ckrqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true}, (err) => {
    if (!err){console.log('MongoDB Connection Succeeded')}
    else {console.log('Error in DB connection : ' + err)}
});



require('./film.model');
require('./customer.model');
require('./rental.model');