const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [3, "Firstname must be at least 3 characters long"],
      },
      lastname: {
        type: String,
        minlength: [3, "Lastname must be at least 3 characters long"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, "Color must be at least 3 characters long"],
      },
      plate: {
        type: String,
        required: true,
        minlength: [3, "Plate must be at least 3 characters long"],
      },
      capacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least 1"],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ["car", "motorcycle", "auto"],
      },
    },

    location: {
      ltd: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
      totalScore: {
        type: Number,
        default: 0,
      },
    },

    earnings: {
      total: {
        type: Number,
        default: 0,
      },
      today: {
        type: Number,
        default: 0,
      },
      thisWeek: {
        type: Number,
        default: 0,
      },
      thisMonth: {
        type: Number,
        default: 0,
      },
    },

    totalRides: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
  return token
}

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

captainSchema.statics.hashPassword = async (password) => await bcrypt.hash(password, 10)

captainSchema.methods.updateRating = function (newRating) {
  this.rating.totalScore += newRating
  this.rating.totalRatings += 1
  this.rating.average = this.rating.totalScore / this.rating.totalRatings
  return this.save()
}

captainSchema.methods.addEarnings = function (amount) {
  this.earnings.total += amount
  this.earnings.today += amount
  this.earnings.thisWeek += amount
  this.earnings.thisMonth += amount
  this.totalRides += 1
  return this.save()
}

const captainModel = mongoose.model("captain", captainSchema)

module.exports = captainModel
