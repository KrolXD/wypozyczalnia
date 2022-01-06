require('./models/db');


const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Customers = mongoose.model('Customers');
const bcrypt = require('bcrypt');
const sesion = require('express-session');

const filmController = require('./controllers/filmController');
const customersController = require('./controllers/customersController');
const rentalController = require('./controllers/rentalController');
const loginController = require('./controllers/loginController');



var app = express();


app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('vies', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'public')));

app.use(sesion({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,

}));


app.get('', (req,res)=>{
    req.session.userPermission = 0;
    res.render('login/login');
});

app.use('/films', filmController);
app.use('/customers', customersController);
app.use('/rental', rentalController);
app.use('/login', loginController);



app.listen(3000,() => {
    console.log('Express server started at port : 3000');
});
