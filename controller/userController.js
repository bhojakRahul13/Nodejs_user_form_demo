const User = require("../models/userModels");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const nodemailer = require("nodemailer");
const { upload } = require("../middleware/multer");
let bool = true;

module.exports.Register = async (req, res) => {
    try {
        const { First_Name, Last_Name, Email, Password, Phone_No, DOB, Gender, Language } = req.body;

        //See if user exists
        let user = await User.findOne({ Email });
        if (user) {
            return res
                .status(400)
                .json({ msg: "user Already exist!!" });
        }
        console.log("language", Language);
        user = new User({
            First_Name,
            Last_Name,
            Email,
            Password,
            Phone_No,
            DOB,
            Gender,
            Language: Language.split(","), // array  multiple data 
            Profile: req.file.path,
        });
        // Encrypt password

        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(Password, salt);

        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'yourmail@gmail.com',
                pass: "your password"
            }
        });
        console.log(Email);
        let details = {
            from: "yourmail@gmail.com",
            to: Email,
            subject: "Message",
            html: `<h2>Sign-in Sucessfully</h2>`

        };
        transport.sendMail(details, (err, info) => {
            if (err) {
                bool = false;

            } else {
                console.log("send sucessfully", info.response);
                bool = true;
            }
        });
        if (bool == true) {
            await user.save();
            res.json({ msg: "Sign-up successfully" });
        }
        else {
            res.json({
                msg: "no"

            });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("server error");
    }
};

module.exports.Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { Email, Phone_No, Password } = req.body;
    let _pnumber =0;
    if(!isNaN(Email)){
        _pnumber = parseInt(Email);
    }
    console.log(req.body);
    try {
        //See if user exists
        let user = await User.findOne({ $or: [{ Email }, { Phone_No:_pnumber}] });

        if (!user) {
            res.status(400).json({ msg: "Invalid Credentials !" });
        }

        //Match password
        const isMatch = await bcrypt.compare(Password, user.Password);

        if (!isMatch) {
            res.status(400).json({ msg: "Invalid Password !" });
        }
        //Jwt Token
        const payload = {
            user: {
                id: user.id,
                userType:user.IsAdmin ?? false, 
                //email: user.email, //not send email  if it is role base we need to gave email and pass role.
            },
        };
        jwt.sign(
            payload,
            config.get("jwtToken"), { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ msg: "Login success", token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
};

module.exports.GetUserById = async (req, res) => {
    console.log("called", req.params.id);
    await User.findById(req.params.id, (err, users) => {
        if (err) {
            return res
                .status(400)
                .json({ err: true, message: "No user with this Id" });
        } else {
            return res
                .status(200)
                .json({ err: false, message: "User By Id", users: users });
        }
    });
};