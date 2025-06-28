import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');

      // Avoid parsing "undefined" or corrupted data
      if (!storedUser || storedUser === "undefined") return null;

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  const login = (userData) => {
  // Normalize _id
  const normalizedUser = {
    ...userData,
    _id: userData._id || userData.id // ✅ fallback if id is present instead of _id
  };

  setUser(normalizedUser);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
