const express = require('express');
const passport = require('passport');
const Todo = require('../models/todo');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Middleware for todo list Router');
  next();
});

// Create a new TODO item
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({
      title,
      description,
      user: req.user._id,
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create TODO item' });
  }
});

// Update the status of a TODO item
router.patch('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ error: 'TODO item not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update TODO item status' });
  }
});

module.exports = router;
