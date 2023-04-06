const express = require("express");
const authenticateUser = require("../middlewares/authenticateUser");
const { createUser, loginUser } = require("../controllers/userController");
const router = express.Router();


router.post('/signin', loginUser);
router.post('/signup', createUser);


module.exports = router;