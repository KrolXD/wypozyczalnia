const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Rent = mongoose.model('Rent');
const Films = mongoose.model('Films');
const Customers = mongoose.model('Customers');

router.get('', (req,res)=>{
    if(req.session.userPermission === 1)
    {
        var custID = new mongoose.mongo.ObjectId(req.session.user_id);
        Rent.find({}).lean().exec((err, docs) => {
            console.log(custID);
            docs.filter(item => item.customerData.customer_id === custID);
            console.log(docs);
            res.render('rental/rental',{
                list: docs
            });
        });
    }
    else if(req.session.userPermission === 2)
    {
        Rent.find({}).lean().exec((err, docs) => {
            console.log(custID);
            console.log(docs);
            res.render('rental/rentalAdmin',{
                list: docs
            });
        });
    }
});

router.get('/return/:id', (req, res) => {
    Rent.findByIdAndUpdate(req.params.id, {$set:{
        date_of_actual_return: new Date(+new Date() + 7*24*60*60*1000)
    }}, {new: true} , (err, docRent) => {
        if (!err) {
            Films.findByIdAndUpdate(docRent.filmData.film_id,{$set:{
                dostepnosc: true
            }},{new: true} , (err, doc) => {
                Customers.findByIdAndUpdate(docRent.customerData.customer_id,{"$inc": { "activeRentals": -1 }},{new: true} , (err, doc) => {
                    if (!err) {
                        res.redirect('/rental');
                    }
                    else
                    {
                        console.log('Error while return :' + err);
                    }
                });
            });
        }
        else { console.log('Error while return :' + err); }
    });
});

module.exports = router;