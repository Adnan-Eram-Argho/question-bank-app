import { motion } from 'framer-motion';

/**
 * AnimatedBackground — subtle geometric shapes that slowly drift, rotate, and pulse.
 * Fixed behind all content (z-index: -1), pointer-events: none.
 * Colors drawn from the project's earthy green/amber/gold Tailwind theme at 4–8% opacity.
 */
const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Shape 1 — large soft circle, top-left, green */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          border: '1px solid rgba(34, 197, 94, 0.05)',
        }}
        animate={{ rotate: [0, 360], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Shape 2 — large thin circle, bottom-right, gold */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-15%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px solid rgba(245, 158, 11, 0.06)',
        }}
        animate={{ rotate: [0, -360], scale: [1, 1.05, 1] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      />

      {/* Shape 3 — medium circle, center-right, green */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(34, 197, 94, 0.04)',
        }}
        animate={{ rotate: [0, 360], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />

      {/* Shape 4 — large blurred ring, center, green/gold mix */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.03) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Shape 5 — triangle, top-right, gold */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '25%',
          width: 100,
          height: 100,
        }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      >
         <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L10 80H90L50 10Z" stroke="rgba(245, 158, 11, 0.06)" strokeWidth="1" />
         </svg>
      </motion.div>

      {/* Shape 6 — triangle, bottom-left, green */}
       <motion.div
        style={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          width: 120,
          height: 120,
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      >
         <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L10 80H90L50 10Z" stroke="rgba(34, 197, 94, 0.06)" strokeWidth="1" />
         </svg>
      </motion.div>

    </div>
  );
};

export default AnimatedBackground;
