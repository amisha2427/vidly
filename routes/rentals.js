const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async(req,res) =>{
  //Genre.find() returns a promise
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async(req,res) =>{
  const {error} = validate(req.body);
  if(error)
  {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if(!customer)
    return res.status(400).send('Invalid Customer');

  const movie = await Movie.findById(req.body.movieId);
  if(!movie)
    return res.status(400).send('Invalid Movie');

  if(movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock');

  // USING MONGOOSE
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  /*rental = await rental.save();

  movie.numberInStock--;
  movie.save();*/

  // USING FAWN
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {
        $inc: { numberInStock: -1}
      })
      .run();

    res.send(rental);
  }
  catch
  {
      res.status(500).send('Something failed');
  }
});

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if(error)
    return res.status(400).send(error.details[0].message);

  const rental = await Rental.findByIdAndUpdate(req.params.id, {
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
   },
  {new: true
  });
  if(!rental)
    return res.status(404).send('Rental with given id was not found');
  res.send(rental);
});

router.delete('/:id', async(req,res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if(!rental)
    return res.status(404).send('Rental not found');

    // Return the same course
  res.send(rental);
});

router.get('/:id', async (req,res) =>{
  const rental = await Rental.findById(req.params.id);
  if(!rental)
    return res.status(404).send('Rental not found');
  res.send(rental);
});

module.exports = router;