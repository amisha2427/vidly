const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Genre, validate} = require('../models/genre');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


/*const genres = [
  {id: 1, name: 'Action'},
  {id: 2, name: 'Horror'},
  {id: 3, name: 'Romance'},
];*/

/*router.get('/', (req, res) =>
{
  res.send('Welcome to the world of movie genre');
});*/

/*router.get('/', (req,res) =>{
  res.send(genres);
});*/
router.get('/', async(req,res) =>{
  throw new Error('Could not get the genres.');
  //Genre.find() returns a promise
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', auth, async(req,res) =>{
  const schema = {
    name: Joi.string().min(3).required()
  };
  const result = Joi.validate(req.body, schema);
  //console.log(result);

  if(result.error)
  {
    return res.status(400).send(result.error.details[0].message);
  }

  /*const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);*/

  // USING MONGOOSE
  let genre = new Genre({name: req.body.name});
  genre = await genre.save();

  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if(error)
    return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name },
  {new: true
  });
  if(!genre)
    return res.status(404).send('Genre with given id was not found');
  res.send(genre);
});

router.delete('/:id', [auth, admin], async(req,res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if(!genre)
    return res.status(404).send('Movie not found');

    // DELETE
  /*  const index = genres.indexOf(genre);
    genres.splice(index,1);*/

    // Return the same course
    res.send(genre);
});

router.get('/:id', validateObjectId, async (req,res) =>{
  const genre = await Genre.findById(req.params.id);
  
  if(!genre)
    return res.status(404).send('Movie not found');
  
    res.send(genre);
});

module.exports = router;
