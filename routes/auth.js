const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.use((req, res, next) => {
    console.log('Middleware for my auth Router');
    next();
  });

// Register a new user in TODO list app
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const accessToken = jwt.sign({ user_id: user._id }, 'your-secret-key', {
          expiresIn: '1h', // Token expires in 1 hour
        });
        const refreshToken = jwt.sign({ user_id: user._id }, 'refresh-secret-key');

        return res.json({ accessToken, refreshToken });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
   // need implementation for the token invalidation
  res.json({ message: 'Logout successful' });
});

// Refresh Token
router.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;

  jwt.verify(refreshToken, 'refresh-secret-key', (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ user_id: user.user_id }, 'your-secret-key', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    return res.json({ accessToken });
  });
});

module.exports = router;
