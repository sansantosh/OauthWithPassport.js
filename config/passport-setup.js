const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model')

passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
    // options for the google strat
    callbackURL: '/auth/google/redirect',
    clientID:keys.google.clientID,
    clientSecret:keys.google.clientSecret

    }, (accessToken, refreshToken, profile, done) => {

        // check if user already exist

        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have the user
                console.log('old user is', currentUser);
                done(null, currentUser);
            } else {
                // if not, create new user
                console.log('new user is', profile);
                new User({
                    username : profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log('new User created:' , newUser);
                    done(null, newUser);
                })
            }
        })

    })
);