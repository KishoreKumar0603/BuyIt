import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-bootstrap";
import { CartProvider } from "./context/cartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
