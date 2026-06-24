import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bb_user")) || null; }
    catch { return null; }
  });
  const [role, setRole] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bb_user"))?.role || null; }
    catch { return null; }
  });
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  /* ── Real API login ── */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem("bb_token", token);
      localStorage.setItem("bb_user",  JSON.stringify(userData));
      setUser(userData);
      setRole(userData.role);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check credentials.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /* ── Real API register ── */
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(formData);
      const { token, user: userData } = res.data;
      localStorage.setItem("bb_token", token);
      localStorage.setItem("bb_user",  JSON.stringify(userData));
      setUser(userData);
      setRole(userData.role);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("bb_token");
    localStorage.removeItem("bb_user");
    setUser(null);
    setRole(null);
    setCart([]);
    setError(null);
  };

  /* ── Cart ── */
  const addToCart = (book) => {
    setCart((prev) =>
      prev.find((b) => (b._id || b.id) === (book._id || book.id))
        ? prev
        : [...prev, { ...book, quantity: 1 }]
    );
  };
  const removeFromCart = (bookId) =>
    setCart((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      role, user, cart, loading, error,
      login, register, logout,
      addToCart, removeFromCart, clearCart,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
