// src/components/dashboard/DashboardHeader.jsx
import { memo } from 'react'
import { motion } from 'framer-motion'

export const DashboardHeader = memo(({ title, subtitle, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
        {actions}
      </div>
    </motion.div>
  )
})

DashboardHeader.displayName = 'DashboardHeader'
