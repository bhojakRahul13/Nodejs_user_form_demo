const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ exposedHeaders: "x-auth-token" }));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-with,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT", "GET", "DELETE", "PATCH");
    return res.status(200).json({});
  }
  next();
});


app.use("/uploads", express.static("uploads"));

const db = require("./config/db");
db();


app.use("/api", require("./routes/userRoutes")); //register,login  Route

app.listen(4000, () => {
  console.log("Server start in port : 4000");
});




