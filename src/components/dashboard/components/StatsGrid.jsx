// src/components/dashboard/StatsGrid.jsx
import { memo } from 'react'
import { motion } from 'framer-motion'
import { StatsCard } from './StatsCard'

export const StatsGrid = memo(({ stats, variants }) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={variants.container}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <motion.div key={stat.id} variants={variants.item}>
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  )
})

StatsGrid.displayName = 'StatsGrid'
