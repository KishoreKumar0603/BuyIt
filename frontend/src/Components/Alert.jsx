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
  if(!show) return null
  ;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="custom-alert bg-white px-4 py-2"
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
