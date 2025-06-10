'use client'

import { motion } from 'framer-motion'

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
  >
    {children}
  </motion.div>
)

export const SlideUp = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={slideUp}
  >
    {children}
  </motion.div>
)

export const StaggerContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={fadeIn}>
    {children}
  </motion.div>
)