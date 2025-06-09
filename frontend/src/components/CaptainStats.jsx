"use client"

import { Star, TrendingUp, Car, Wallet } from "lucide-react"

const CaptainStats = ({ captain }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const stats = [
    {
      icon: Star,
      label: "Rating",
      value: captain?.rating?.average ? captain.rating.average.toFixed(1) : "0.0",
      subtext: `${captain?.rating?.totalRatings || 0} reviews`,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Wallet,
      label: "Total Earnings",
      value: formatCurrency(captain?.earnings?.total),
      subtext: "All time",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      label: "Today's Earnings",
      value: formatCurrency(captain?.earnings?.today),
      subtext: "Today",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Car,
      label: "Total Rides",
      value: captain?.totalRides || 0,
      subtext: "Completed",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <IconComponent size={20} className={stat.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800 truncate">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CaptainStats
