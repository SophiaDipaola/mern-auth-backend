require('dotenv').config();
// A passport strategy for authenticating with a JSON Web Token
// This allows to authenticate endpoints using a token
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
const { Strategy, ExtractJwt} = require('passport-jwt')
const mongoose = require('mongoose')

//import user model
const {User} = require('../models/user')

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.JWT_SECRET

module.exports = (passport) => {
    
    passport.use(new Strategy(options, (jwt_payload,done)=>{
        //have a user that we're finding byt the id inside the payload
        //when we get the user back, we'll check to see if the user is in the DB

        User.findById(jwt_payload.id)
        .then(user => {
            //jwt_payload is an object that contains JWT info
            //done is a callback that we will be using to return user or false
            if(user){
                //if a user is found , return done with null (for error) and user
                return done(null, user)
            }else{
                return done (null,false)
            }
        })
        .catch(error=>{
            console.log('======> error below(passport.js')
            console.log(error)
        })
    }))
}