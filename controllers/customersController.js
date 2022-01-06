const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Customers = mongoose.model('Customers');



router.get('', (req,res)=>{
    Customers.find({}).lean().exec((err, docs) => {
        if (!err) {
            docs.forEach(setData);
            if(req.session.userPermission === 1)
            {
                res.redirect('/films');
            }
            else if(req.session.userPermission === 2)
            {
                res.render('customers/customers',{
                    list: docs
                });
            }else{
                res.redirect('/');
            }
        }
        else {
            console.log('Error : + ' + err);
        }
    });
});

//add or edit

router.get('/addEditCustomers',(req, res) => {
    Customers.find((err, docs) => {
        if (!err) {
                res.render("customers/addEditCustomers", {
                list: docs
            });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

router.post('/addEditCustomers', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var customer = new Customers();
    customer.name = req.body.name;
    customer.lastName = req.body.lastName;
    customer.address = req.body.address;
    customer.phoneNumber = req.body.pNumber;
    customer.dateOfRegistration = req.body.date;
    customer.save((err, doc) => {
        if (!err)
            res.redirect('/Customers');
        else {
            console.log('Error : ' + err);
        }
    });
}

router.get('/addEditCustomers/:id', (req, res) => {
    Customers.find({_id: req.params.id}).lean().exec((err, doc) => {
        var date = new Date(doc[0].dateOfRegistration);
        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();
        if(m < 10)
        {
            m = "0"+m;
        }
        if(d < 10)
        {
            d = "0"+d;
        }
        var fulldate = y+"-"+m+"-"+d;
        doc[0].dateOfRegistration = fulldate;
        if (!err) {
                res.render('customers/addEditCustomers',{
                    list: doc[0]
                });
            }
            else {
                console.log('Error : + ' + err);
            }
        });
});

function updateRecord(req, res) {
    Customers.findByIdAndUpdate(req.body._id, {$set:{
        name: req.body.name,
        lastName: req.body.lastName,
        dateOfRegistration: req.body.dateOfRegistration,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
    }}, {new: true} , (err, doc) => {
        if (!err) {
            res.redirect('/customers'); }
        else {
            if (err.name == 'ValidationError') {
                res.render("customers/addEditCustomers", {
                    list: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

function setData(obj)
{
    var date = new Date(obj.dateOfRegistration);
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    if(m < 10)
    {
        m = "0"+m;
    }
    if(d < 10)
    {
        d = "0"+d;
    }
    var fulldate = y+"-"+m+"-"+d;
    obj.dateOfRegistration = fulldate;
    console.log(obj);
}

//usuwanie
router.get('/delete/:id', (req, res) => {
    Customers.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/customers');
        }
        else { console.log('Error in customer delete :' + err); }
    });
});

module.exports = router;