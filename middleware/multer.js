var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

//Image allow jpeg,png,jpg
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Image 5 mb allows
var upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5, //5mb
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
};
