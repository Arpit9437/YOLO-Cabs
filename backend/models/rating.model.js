const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
      required: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
)

ratingSchema.index({ ride: 1 }, { unique: true })

const ratingModel = mongoose.model("rating", ratingSchema)

module.exports = ratingModel
