const ratingModel = require("../models/rating.model")
const captainModel = require("../models/captain.model")
const { validationResult } = require("express-validator")

module.exports.submitRating = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { rating, comment, captainId, rideId } = req.body
    const userId = req.user._id

    const existingRating = await ratingModel.findOne({ ride: rideId })
    if (existingRating) {
      return res.status(400).json({ message: "Rating already submitted for this ride" })
    }

    const newRating = new ratingModel({
      user: userId,
      captain: captainId,
      ride: rideId,
      rating,
      comment,
    })

    await newRating.save()

    const captain = await captainModel.findById(captainId)
    if (captain) {
      await captain.updateRating(rating)
    }

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating,
    })
  } catch (error) {
    console.error("Error submitting rating:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports.getCaptainRatings = async (req, res) => {
  try {
    const { captainId } = req.params
    const { page = 1, limit = 10 } = req.query

    const ratings = await ratingModel
      .find({ captain: captainId })
      .populate("user", "fullname")
      .populate("ride", "pickup destination fare")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await ratingModel.countDocuments({ captain: captainId })

    res.status(200).json({
      ratings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching ratings:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
