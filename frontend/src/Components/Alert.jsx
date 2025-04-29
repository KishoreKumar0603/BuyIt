import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/css/components/Alert.css";

const Alert = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="custom-alert bg-white p-3"
        >
          <div className="alert-content w-100 d-flex flex-row justify-content-around align-items-center">
            <span className="alert-text">{message}</span>
            <button className="ok-btn p-1" onClick={onClose}>OK</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
