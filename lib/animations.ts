import { Variants } from 'framer-motion'

// Shared easing
export const easeOut = [0.22, 1, 0.36, 1]

// Viewport settings for scroll-triggered animations
export const viewportSettings = { once: true, margin: '-80px' }

// Fade up animation
export const fadeUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

// Alias for fadeUp (for backward compatibility)
export const fadeInUp = fadeUp

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

// Slide from left
export const slideLeft: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

// Slide from right
export const slideRight: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

// Scale in animation
export const scaleIn: Variants = {
  hidden: { scale: 0.92, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
}

// Stagger container
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Alias for stagger
export const staggerContainer = stagger

// Stagger faster for lists
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// Custom delay fade up (for sequential hero animations)
export const fadeUpWithDelay = (delay: number): Variants => ({
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
      delay,
    },
  },
})

// Hover scale animation
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: easeOut },
}

// Tap scale animation
export const tapScale = {
  scale: 0.98,
}

// Card hover animation
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 32px rgba(21,128,61,0.15), 0 2px 8px rgba(0,0,0,0.08)',
    transition: { duration: 0.25, ease: easeOut },
  },
}

// Slide up for mobile elements
export const slideUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
}

// Mobile menu animation
export const mobileMenuVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: easeOut,
      when: 'afterChildren',
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easeOut,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
}

export const mobileMenuItemVariants: Variants = {
  closed: { x: -20, opacity: 0 },
  open: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.2, ease: easeOut },
  },
}
