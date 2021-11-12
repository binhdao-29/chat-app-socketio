const router = require("express").Router();
const multer = require('multer');
const { catchErrors } = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");

//define storage for the images

const storage = multer.diskStorage({

  //destination for files
  destination: function (req, file, callback) {
    callback(null, '../frontend/public/images');
  },

  //add back the extension
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

//upload parameters for multer
const upload = multer({
  storage: storage,
});

router.post("/login", catchErrors(userController.login));
router.post("/register", upload.single('image'), catchErrors(userController.register));

module.exports = router;
