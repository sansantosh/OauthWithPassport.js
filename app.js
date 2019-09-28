const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes')
const app = express();
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport =  require('passport')


//se up view engine

app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 10000,
    keys: [keys.session.cookieKey]
}));


//  initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('home', {user:req.user, thumbnail: req.thumbnail});
})

// connect to mongoosedb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('conected to mongodb');
})

app.listen(3000, () => {
    console.log('i am listing');
})