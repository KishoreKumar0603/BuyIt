import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-bootstrap";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AlertProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AlertProvider>
  </AuthProvider>
);
