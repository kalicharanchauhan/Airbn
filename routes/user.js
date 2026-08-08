const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/",async(req,res)=>{
    res.render("./user/signup.ejs");
});

router.post("/",async(req,res)=>{
    let {username, email,password} = req.body;
    const newUser = new User({emali,password});
    User.register(newUser,password);
})

module.exports = router;