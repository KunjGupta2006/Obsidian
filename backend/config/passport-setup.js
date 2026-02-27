import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userSchema.js";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            console.log("user already exists");
          return done(null, user);
        }

        // create new user
        user = await User.create({
          googleId: profile.id,
          fullname: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });

        console.log("new user created");
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

