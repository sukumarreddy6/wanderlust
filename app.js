if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
    // console.log(process.env.SECRET);
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

// Import Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// implementation of flash
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// ==================================================
// DATABASE
// ==================================================

//const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL:", process.env.ATLASDB_URL);
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    //await mongoose.connect(mongoUrl);
    await mongoose.connect(dbUrl);
}

// ==================================================
// MIDDLEWARE
// ==================================================
// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto:{
//         secret:process.env.SECRET
//     },
//     touchAfter: 24 * 3600, // The session is only updated if at least 24 hours have passed since the last update. (in sec)
// });

// store.on("error", ()=>{
//     console.log("Error in Mongo Session Store", err);
// });

const sessionOptions = {
    store, // new line
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};



app.use(session(sessionOptions));
app.use(flash()); // must be used before requiring routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ==================================================
// HOME ROUTE
// ==================================================

// app.get("/", (req, res) => {
//     res.send("Request received");
// });

// ==================================================
// ROUTES
// ==================================================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});

app.get("/demouser", async(req, res)=>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    });
    let registeredUser = await User.register(fakeUser,"Skmr_123");
    res.send(registeredUser);
}); 

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// ==================================================
// ERROR HANDLER
// ==================================================

// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong" } = err;

//     res.status(statusCode).render("error.ejs", { message });
// });

// ==================================================
// SERVER
// ==================================================

app.listen(8080, () => {
    console.log("Server listening on port 8080");
});