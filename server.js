const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/user');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const healthCheckRoutes = require('./routes/healthcheck');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const mongoDBConnectionUrl = 'mongodb+srv://souravPatra:passwordDBMongo@cluster0.akmxiis.mongodb.net/?retryWrites=true&w=majority' ;
const jwtSecretKey = 'my-jwt-secret' ;

// mongodb connection set up
mongoose.connect(mongoDBConnectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useCreateIndex: true,
});


//JWT configuration
const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecretKey,
};

passport.use(
  new jwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.user_id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

app.use(passport.initialize());  

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes); 
app.use('/health', healthCheckRoutes);

app.listen(port, () => {
  console.log(`TODO list Server is running on port ${port}`);
});
