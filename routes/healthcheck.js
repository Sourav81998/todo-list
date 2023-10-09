const express = require('express');
const passport = require('passport');
const Todo = require('../models/todo');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Middleware for myRouter');
  next();
});

// Create a new TODO item
router.get('/healthcheck', async (req, res) => {
  try {
    res.json("App server is healthy..");
  } catch (error) {
    res.status(500).json({ error: 'Failed ' });
  }
});



module.exports = router;
