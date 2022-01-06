const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Customers = mongoose.model('Customers');
const bcrypt = require('bcrypt');


router.get('', (req,res)=>{
    res.render('login/login');
});

router.get('/registration', (req,res)=>{
    res.render('login/registration');
});

router.post('/registration', (req, res) => {
    insertUser(req, res);
});


async function insertUser(req, res) {
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(await bcrypt.compare(req.body.password, hashedPassword));
        console.log(hashedPassword);
        var user = new User();
        user.username = req.body.username;
        user.password = hashedPassword;
        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.address = req.body.address;
        user.phoneNumber = req.body.pNumber;
        user.save((err, doc) => {
            if (!err)
                insertCustomer(req, res);
            else {
                var error = err+"";
                if(error.indexOf("E11000 duplicate key error collection: rental.users index: username_1 dup key") !== -1)
                {
                    req.body['validationError'] = "This login is taken!";
                    res.render('login/registration', {
                        list: req.body
                    });
                }
                else{
                    res.status(500).send();
                }
            }
        });

    } catch {
        console.log('Error : ' + err);
    }
}
function insertCustomer(req, res)
{
    var customer = new Customers();
    customer.name = req.body.name;
    customer.lastName = req.body.lastName;
    customer.address = req.body.address;
    customer.phoneNumber = req.body.pNumber;
    User.find({username: req.body.username}).lean().exec(async function(err, docs){
        customer.user_id = docs[0]._id;
    });
    customer.save((err, doc) => {
        if (!err)
        {
            res.redirect('/login');
        }
        else {
            console.log('Error : ' + err);
        }
    });
}

//LOGOWANIE

router.post('', async function(req, res)
{
    User.find({username: req.body.username}).lean().exec(async function(err, docs){
    if (!err) {
        if(docs[0] !== undefined){
            const valid = await bcrypt.compare(req.body.password, docs[0].password);
            if(valid)
            {
                if(docs[0].admin == 0)
                {
                    req.session.userPermission = 1;
                    req.session.user_id = docs[0]._id.toString();
                    console.log(req.session.user_id);
                    res.redirect('/films');
                }
                else if(docs[0].admin == 1)
                {
                    req.session.userPermission = 2;
                    res.redirect('/films');
                }

            }
            else{
                req.body['validationError'] = "Incorrect login or password!";
                    res.render('login/login', {
                    list: req.body
                });
            }
        }
        else
        {
            req.body['validationError'] = "Incorrect login or password!";
                res.render('login/login', {
                list: req.body
            });
        }
    }
    else {
        console.log('Error : + ' + err);
    }
    });
});



module.exports = router;