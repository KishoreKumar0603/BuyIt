import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CustomAlert = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="custom-alert"
    >
      <div className="alert-content">
        <span className="alert-text">{message}</span>
        <span className="close-btn" onClick={onClose}>&times;</span>
      </div>
    </motion.div>
  );
};

export default CustomAlert;
