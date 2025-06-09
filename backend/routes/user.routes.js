const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require('../middleware/auth.middleware')

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email."),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name should be atleast 3 characters long."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least characters long."),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least characters long."),
  ],
  userController.LoginUser
);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = router;
