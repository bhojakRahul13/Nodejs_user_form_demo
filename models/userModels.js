const mongoose = require("mongoose");

let users = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true,
    },
    Last_Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
        unique: true,
    },
    Phone_No: {
        type: Number,
        required: true,
        unique: true,
    },
    DOB: {
        type: Date,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    Language: {
        type: [String], //add multiple so we used array
        required: true,
        //enum: ["Hindi","English", "Gujarati"] //we used enum for specific filed to added
    },
    Profile: {
        type: String,
        required: true,
    },
    IsAdmin:{
        type:Boolean,
        default:false
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Users", users);

