"use client"

import { useState } from "react"
import { Star, X, MessageCircle } from "lucide-react"

const RatingModal = ({ isOpen, onClose, captain, ride, onSubmitRating }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmitRating({
        rating,
        comment: comment.trim(),
        captainId: captain._id,
        rideId: ride._id,
      })
      onClose()
      setRating(0)
      setComment("")
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Rate Your Trip</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Captain Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">{captain?.fullname?.firstname?.charAt(0) || "C"}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 capitalize">
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </h4>
              <p className="text-sm text-gray-600">{captain?.vehicle?.plate}</p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="text-center">
            <p className="text-gray-700 mb-4 font-medium">How was your ride?</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rating === 0 && "Tap to rate"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={16} className="text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Add a comment (optional)</label>
            </div>
            <textarea
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingModal
