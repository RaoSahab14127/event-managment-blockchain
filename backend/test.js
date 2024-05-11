
const express = require("express");
const fs = require("fs");
const users =  require('./mockData.json');
const mongoose = require('mongoose');
const { type } = require("os");



const app = express();
//connection:
mongoose.connect("mongodb://127.0.0.1:27017/eventblock")

// schema
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String

    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    jobTitle:{
        type: String,
    },
    gender:{
        type: String,
    }
})
const User = new mongoose.model("user", userSchema);




// midleware
app.use(express.urlencoded({extended: false}))



// routes
app.get("/",(req, res)=>{
    res.send(`Hello`)
})
app.get("/api/users",(req, res)=>{
    res.json(users)
})
app
.get("/api/users/:id", (req, res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=> {if (user.id==id){ return user}})
    return res.json(user)
})
.post("/api/users/", (req, res)=>{
    let data = req.body;
    users.push({...data, id: users.length+1})
    fs.writeFile("mockData.json",JSON.stringify(users), (err)=>{err})
})


app.listen(8001, ()=> console.log("srever is up..."))