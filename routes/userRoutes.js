const express = require("express");
const router = express();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const config = require("config");
const nodemailer = require("nodemailer");
const { upload } = require("../middleware/multer");
const auth = require('../middleware/auth');
const { Register, Login, Display, GetUserById } = require("../controller/userController");
let bool = true;

//Register User Routes
//@public 

router.post("/sign-up", upload.single("Profile"), [
    check("First_Name", "First_Name is required").not().isEmpty(),
    check("Last_Name", "Last_Name is required").not().isEmpty(),
    check("Email", "Please include a valid Email").isEmail(),
    check("Password", "enter Password").not().isEmpty(),
    check("Phone_No", "Phone_No is required and it should be number only").not().isEmpty().isNumeric().isLength({ min: 10, max: 12 }),
    check("DOB", "Date of Birth is required").not().isEmpty(),
    check("Gender", "gender is required").not().isEmpty(),
    check("Language", "Address is required").not().isEmpty(),
    check("Profile", "Plz Include Profile PIC").isEmpty()
], Register
);


//Login Route 
//Public 

router.post(
    "/sign-in", [
    check("Password", "Enter Password").not().isEmpty(),
],
    Login
);

//Display  User Route
//Private 



router.get("/display", async (req, res) => {
    try {
        const { page, limit } = req.query;
        const _pageSize = parseInt(limit);
        const _page = parseInt(page);
        const total_records = await User.countDocuments();
        let user = await User.find()
            .select("-Password")
            .skip(Math.max(0, _page - 1) * _pageSize)
            .limit(_pageSize);


        return res.json({ total_User: user.length, total_records, user });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("server Error");
    }
});


//retrive data By  ID
//Private
router.get("/user/:id", GetUserById);

module.exports = router;
