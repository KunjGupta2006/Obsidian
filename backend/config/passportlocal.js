import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Try login using Google",
          });
        }

        if (!password) {
          return done(null, false, {
            message: "Password required",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, {
            message: "Wrong password",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
