const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  .get('/', (req, res) => {
    let recipeQuery = {};
    if(req.query.ingredient) {
      recipeQuery = { 'ingredients.name': req.query.ingredient };
    }

    Recipe
      .find(recipeQuery)
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })

  .get('/:id', (req, res) => {
    Recipe
      .findById(req.params.id)
      .populate('events')
      .then(recipes => res.send(recipes.toJSON({ virtuals:true })));
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      Recipe.findByIdAndDelete(req.params.id),
      Event.deleteMany({ recipeId: req.params.id })
    ])
      .then(([recipe]) => res.send(recipe));
  });
