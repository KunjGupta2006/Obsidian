import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import sanitize from "mongo-sanitize";

import session from "express-session"
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passportlocal.js";
import "./config/passport-setup.js";
import "./config/passport.js";

import watchRouter from "./routes/watchRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartroutes.js";
import wishlistRouter from "./routes/wishlistroutes.js";
import orderRouter from "./routes/orderRoutes.js";
import adminRouter from "./routes/adminRoutes.js";


dotenv.config();
// env variables
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URI=process.env.FRONTEND_URI;
const SESSION_SECRET=process.env.SESSION_SECRET;

const app = express();

const corsOptions = {
  origin: FRONTEND_URI,
  credentials: true,
}

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(
  session({
    secret:SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (https)
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ← add this
      maxAge: 7*24 * 60 * 60 * 1000, // 7 day
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

// DB connection
  mongoose.connect(MONGODB_URI)
  .then(()=>{
    // start server
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    })
  })
  .catch((error)=>{
    console.log("MongoDB connection failed:", error.message);
});

// test route
app.get("/api", (req, res) => {
  res.send("Server working fine");
});

// routes
app.use("/api/watches", watchRouter);
app.use("/api/user",userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders",orderRouter);
app.use("/api/admin",adminRouter);