const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const ejs = require('ejs');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const { error } = require("console");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./Joi/schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const reviewSchema = require("./Joi/review.js");
const listing = require("./routes/listing.js");
const { kMaxLength } = require("buffer");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
// const User = require("./models/user.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

main().then(() => {
    console.log("connection sucess:");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demouser",async(req,res)=>{
    let fakeuser = new User({
        email:"kali@gmail.com",
        username:"kalicharan"
    });
    const newUser = await User.register(fakeuser,"helloworld");
});

app.use("/listing", listing); 

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
    next();
});

app.use((err, req, res, next) => {
    next(err);
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    res.status(statusCode).render("./listing/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("app is listen on 8080.");
});   