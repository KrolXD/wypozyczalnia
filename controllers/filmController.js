const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Films = mongoose.model('Films');
const Rent = mongoose.model('Rent');
const Customers = mongoose.model('Customers');



router.get('', (req,res)=>{
    Films.find({}).lean().exec((err, docs) => {
    if (!err) {
            docs.forEach(setData);
            if(req.session.userPermission === 1)
            {
                res.render('films/films',{
                    list: docs
                });
            }
            else if(req.session.userPermission === 2)
            {
                res.render('films/filmsAdmin',{
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

router.get('/addEditFilms',(req, res) => {
    console.log(req.session.test);
    Films.find((err, docs) => {
        if (!err) {
            res.render("films/addEditFilms", {
                list: docs
            });
        }
        else {
            console.log('Error :' + err);
        }
    });
});

router.post('/addEditFilms', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var film = new Films();
    film.tytul = req.body.title;
    var tabRezyser = req.body.directors.split(",");
    film.rezyser = tabRezyser;
    var tabGatunek = req.body.genres.split(",");
    film.gatunek = tabGatunek;
    var tabAktorzy = req.body.actors.split(",");
    film.aktorzy = tabAktorzy;
    film.opis = req.body.description;
    film.dataDodania = req.body.added;
    film.ocena = req.body.rating;
    film.czas = req.body.time;
    if(req.body.availability)
    {
        film.dostepnosc = true;
    }
    else
    {
        film.dostepnosc = false;
    }
    film.save((err, doc) => {
        if (!err)
            res.redirect('/films');
        else {
            console.log('Error : ' + err);
        }
    });
}


//update film

router.get('/addEditFilms/:id', (req, res) => {
    Films.find({_id: req.params.id}).lean().exec((err, doc) => {
        var date = new Date(doc[0].dataDodania);
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
        doc[0].dataDodania = fulldate;

        if(doc[0].dostepnosc)
        {
            doc[0].dostepnosc=1;
        }
        else
        {
            doc[0].dostepnosc=0;
        }
        if (!err) {
                res.render('films/addEditFilms',{
                    list: doc[0]
                });
            }
            else {
                console.log('Error : + ' + err);
            }
        });
});

function updateRecord(req, res) {
    if(req.body.availability)
    {
        var availability = true;
    }
    else
    {
        var availability = false;
    }
    var tabRezyser = req.body.directors.split(",");
    var tabGatunek = req.body.genres.split(",");
    var tabAktorzy = req.body.actors.split(",");
    Films.findByIdAndUpdate(req.body._id, {$set:{
    rezyser: tabRezyser,
    gatunek: tabGatunek,
    aktorzy: tabAktorzy,
    tytul: req.body.title,
    opis: req.body.description,
    dataDodania: req.body.added,
    ocena: req.body.rating,
    czas: req.body.time,
    dostepnosc: availability}}, {new: true} , (err, doc) => {
        if (!err) {
            res.redirect('/films'); }
        else {
            if (err.name == 'ValidationError') {
                res.render("films/addEditFilms", {
                    list: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

//usuwanie
router.get('/delete/:id', (req, res) => {
    Films.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/films');
        }
        else { console.log('Error in film delete :' + err); }
    });
});

//wypożyczenie
router.get('/rent/:id', (req, res) => {
    Films.findById(req.params.id, (err, docFilm) => {
        if (!err) {
            var user_id = new mongoose.mongo.ObjectId(req.session.user_id);
            Customers.find({user_id: user_id}, (err, docCustomer) => {
                if (!err) {
                    if(Number(docCustomer[0].activeRentals) !== 3){
                        var rent = new Rent
                        rent.filmData.film_id = docFilm._id;
                        rent.filmData.filmId = docFilm.filmId;
                        rent.filmData.title = docFilm.tytul;
                        rent.customerData.customer_id = docCustomer[0]._id;
                        rent.customerData.customerId = docCustomer[0].customerId;
                        rent.customerData.name = docCustomer[0].name;
                        rent.customerData.lastName = docCustomer[0].lastName;
                        console.log(rent);
                        rent.save((err, doc) => {
                            if (!err){
                                Films.findByIdAndUpdate(docFilm._id, {$set:{
                                    dostepnosc: false}}, {new: true} , (err, doc) => {
                                        if (!err){
                                            var rentalsSum = Number(docCustomer[0].activeRentals) + 1;
                                            console.log(rentalsSum);
                                            Customers.findOneAndUpdate({user_id: user_id}, {$set:{
                                                activeRentals: rentalsSum}}, {new: true} , (err, doc) => {
                                                    if (!err){
                                                        console.log(doc);
                                                        res.redirect('/films');
                                                    }else{
                                                        console.log('Error in film rent :' + err);
                                                    }
                                                });
                                        }else{
                                            console.log('Error in film rent :' + err);
                                        }
                                    });
                            }
                            else {
                                console.log('Error in film rent :' + err);
                            }
                        });
                    }
                    else{
                        res.redirect('/films');
                    }
                }
                else { console.log('Error in film rent :' + err); }
            });
        }
        else { console.log('Error in film rent :' + err); }
    });
});

function setData(obj)
{
    var date = new Date(obj.dataDodania);
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
    obj.dataDodania = fulldate;
}

//wyszukiwanie

router.post('/serch', (req, res) => {
    var question;
    if(req.body.select === "id")
    {
        Films.find({filmId: req.body.question}).lean().exec((err, docs) => {
            if (!err) {
                console.log(docs);
                    docs.forEach(setData);
                    res.render('films/films',{
                        list: docs
                    });
                }
                else {
                    console.log('Error : + ' + err);
                }
            });
    }
    else if( req.body.select === "title")
    {
        Films.find({tytul: req.body.question}).lean().exec((err, docs) => {
            if (!err) {
                console.log(docs);
                    docs.forEach(setData);
                    res.render('films/films',{
                        list: docs
                    });
                }
                else {
                    console.log('Error : + ' + err);
                }
            });
    }
    else if(req.body.select === "genre")
    {
        Films.find({gatunek: req.body.question}).lean().exec((err, docs) => {
            if (!err) {
                console.log(docs);
                    docs.forEach(setData);
                    res.render('films/films',{
                        list: docs
                    });
                }
                else {
                    console.log('Error : + ' + err);
                }
            });
    }
});



module.exports = router;