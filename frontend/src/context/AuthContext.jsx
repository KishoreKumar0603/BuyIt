import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const urlRefreshToken = urlParams.get("refreshToken");

    // Handle OAuth callback tokens from URL
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      if (urlRefreshToken) {
        localStorage.setItem("refreshToken", urlRefreshToken);
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const finalToken = urlToken || token;

    if (finalToken) {
      try {
        const decoded = jwtDecode(finalToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setUser({
            email: decoded.email,
            id: decoded._id,
            token: finalToken,
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
