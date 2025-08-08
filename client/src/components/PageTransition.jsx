import React from "react";
import { motion } from "framer-motion";

const PageTransition = ({ children, className = "" }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
