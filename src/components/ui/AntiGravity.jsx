import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * AntiGravity Component
 * Applies a slow, smooth floating animation to its children.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to float
 * @param {number} props.yOffset - Vertical float distance (default: 6)
 * @param {number} props.xOffset - Horizontal float distance (default: 3)
 * @param {number} props.duration - Animation duration in seconds (default: 6)
 * @param {number} props.delay - Initial delay (default: 0)
 * @param {string} props.className - Additional classes
 */
const AntiGravity = ({
    children,
    yOffset = 6,
    xOffset = 3,
    duration = 6,
    delay = 0,
    className
}) => {
    return (
        <motion.div
            className={cn("relative", className)}
            initial={{ y: 0, x: 0 }}
            animate={{ 
                y: [-yOffset, yOffset, -yOffset],
                x: [-xOffset, xOffset, -xOffset]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: delay,
            }}
            whileHover={{
                scale: 1.02,
                y: -yOffset * 1.5, // Slight elevation on hover
                transition: { duration: 0.3, ease: "easeOut" }
            }}
        >
            {/* Optional: Glow effect wrapper could be added here or via className */}
            <div className="group transition-all duration-300">
                {children}
            </div>
        </motion.div>
    );
};

export default AntiGravity;
