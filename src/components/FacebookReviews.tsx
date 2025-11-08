'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface FBReview {
  reviewer: { name: string }
  rating: number
  review_text: string
}

const FacebookReviews: React.FC = () => {
  const [reviews, setReviews] = useState<FBReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFBReviews = async () => {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID}/ratings?access_token=${process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN}`
        )
        const data = await res.json()
        setReviews(data.data || [])
      } catch (err) {
        setReviews([])
      } finally {
        setLoading(false)
      }
    }
    fetchFBReviews()
  }, [])

  if (loading)
    return <p className="text-center text-gray-400 py-8">Načítavam Facebook recenzie...</p>

  if (!reviews || reviews.length === 0)
    return <p className="text-center text-gray-400 py-8">Žiadne Facebook recenzie k dispozícii.</p>

  return (
    <section id="facebook-reviews" className="py-16 bg-gradient-to-b from-[#1A1A1A] to-[#000] text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">📘 Facebook recenzie</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gradient-to-br from-[#222] to-[#111] rounded-2xl shadow-xl border border-[#333] hover:scale-[1.03] hover:border-yellow-400 transition-transform duration-200"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-yellow-300 mb-1">{r.reviewer?.name}</h3>
              <p className="text-yellow-400 mb-2">{'★'.repeat(r.rating)}</p>
              <p className="text-gray-300 italic mb-3">{r.review_text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FacebookReviews
