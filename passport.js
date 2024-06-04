import {Strategy, ExtractJwt} from 'passport-jwt';
import User from './models/auth.js';
import passport from 'passport';
import "dotenv/config";

    
const secret = process.env.PRIVATE_KEY;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  passport.use(
    new Strategy(opts, function (payload, done) {
      User.find({ email: payload.useremail })
        .then(([user]) => {
          if (!user) {
            return done(new Error("User not found"));
          }
          return done(null, user);
        })
        .catch((err) => done(err));
    })
  );