const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const ratingController = require("../controllers/rating.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.post(
  "/submit",
  authMiddleware.authUser,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("captainId").isMongoId().withMessage("Valid captain ID required"),
    body("rideId").isMongoId().withMessage("Valid ride ID required"),
    body("comment").optional().isLength({ max: 500 }).withMessage("Comment must be less than 500 characters"),
  ],
  ratingController.submitRating,
)

router.get("/captain/:captainId", authMiddleware.authCaptain, ratingController.getCaptainRatings)

module.exports = router
