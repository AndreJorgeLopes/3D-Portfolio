import React from "react";
import { motion } from "framer-motion";

export default function AnimatedWord({
  word,
  color,
  baseDelay = 0,
  wave = true,
}) {
  return (
    <motion.span
      className="inline-block mr-1 select-none z-50"
      whileHover={{
        scale: 1.12,
        rotate: 0.5,
        transition: { type: "spring", stiffness: 220, damping: 12 },
      }}
      style={{ display: "inline-block" }}
    >
      {word.split("").map((char, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ color, textDecorationColor: color }}
          className=" z-50 font-semibold underline underline-offset-4 decoration-2 inline-block cursor-pointer"
          initial={{ opacity: 0.2, y: 8 }}
          animate={wave ? { opacity: 1, y: [0, -6, 0] } : { opacity: 1, y: 0 }}
          transition={{
            delay: baseDelay + i * 0.07,
            duration: wave ? 1.6 : 0.35,
            repeat: wave ? Infinity : 0,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.12, rotate: 0.5 }}
          whileTap={{ scale: 0.96 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
