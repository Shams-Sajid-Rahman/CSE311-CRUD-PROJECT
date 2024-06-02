const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('using multer:', file)
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
