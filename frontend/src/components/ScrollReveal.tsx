import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    amount?: number | 'some' | 'all';
}

/**
 * A beautiful, reusable wrapper for animating components as they scroll into view.
 * Utilizes framer-motion's whileInView API safely.
 */
const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
    children, 
    className = '', 
    direction = 'up',
    delay = 0,
    duration = 0.5,
    amount = 0.1
}) => {
    // Define the directional offsets
    const variants = {
        hidden: { 
            opacity: 0,
            y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
            x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
            scale: direction === 'none' ? 0.95 : 1 // slight scale for non-directional fades
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 260,
                damping: 25,
                delay,
                duration
            }
        }
    };

    if (direction === 'none') {
        variants.hidden.y = 0;
        variants.hidden.x = 0;
    }

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
