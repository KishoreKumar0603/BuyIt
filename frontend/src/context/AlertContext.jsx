import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 3000);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  return (
    <AlertContext.Provider value={{ alertMessage, showAlert, triggerAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook to use alert context easily
export const useAlert = () => useContext(AlertContext);
