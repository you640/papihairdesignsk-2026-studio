
'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Review {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
}

const GoogleReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}&fields=reviews&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
        )
        const data = await res.json()
        setReviews(data.result?.reviews || [])
      } catch (err) {
        setReviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  if (loading)
    return <p className="text-center text-gray-400 py-8">Načítavam Google recenzie...</p>

  if (!reviews || reviews.length === 0)
    return <p className="text-center text-gray-400 py-8">Žiadne Google recenzie k dispozícii.</p>

  return (
    <section id="google-reviews" className="py-16 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">💈 Google recenzie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gradient-to-br from-[#222] to-[#111] rounded-2xl shadow-xl border border-[#333] hover:scale-[1.03] hover:border-yellow-400 transition-transform duration-200"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">{r.author_name}</h3>
              <p className="text-yellow-400 mb-2">{'★'.repeat(r.rating)}</p>
              <p className="text-gray-300 italic mb-3">{r.text}</p>
              <p className="text-sm text-gray-500">{r.relative_time_description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GoogleReviews
