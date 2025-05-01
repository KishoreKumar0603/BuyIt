import React from "react";
import Alert from "../Components/Alert";

import { useAlert } from "./AlertContext";
const CustomAlertWrapper = () => {
  const { alertMessage, showAlert, closeAlert } = useAlert();
  return (
    <Alert message={alertMessage} show={showAlert} onClose={closeAlert} />
  );
};

export default CustomAlertWrapper;
