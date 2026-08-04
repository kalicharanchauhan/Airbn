const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const { messages } = require("../Joi/review");
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(session({
    secret:"mysecretstring",
    resave:false,
    saveUninitialized:true
}));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucessMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    if(name !== "anonymous"){
        req.flash("success", "user register sucessful");
    }else{
        req.flash("error", "User is not register.");
    }
    req.session.name = name;
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
});
 
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent ${req.session.count} times.`);
// });

// app.get("/test",(req,res)=>{
//     res.send("test sucessful.");
// });

app.listen(3000,()=>{
    console.log("connections success.");
});