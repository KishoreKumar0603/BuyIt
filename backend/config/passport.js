import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/user/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // If user exists but doesn't have googleId, link the accounts
            user.googleId = profile.id;
            user.authProvider = "google";
            user.isVerified = true;
            await user.save();
            return done(null, user);
          }

          // Create new user with Google OAuth
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            authProvider: "google",
            isVerified: true,
            profilePic: profile.photos[0].value,
            needsAdditionalInfo: true, // Flag to collect additional info
          });

          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
} else {
  console.log(
    "Google OAuth credentials not found. Google authentication will not be available.",
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
