import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_API_URL}/api/auth`;

  useEffect(() => {
    axios
      .get(`${API}/me`, { withCredentials: true })
      .then(res => {
        setUser(res.data.user || null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await axios.post(`${API}/login`, { email, password }, { withCredentials: true });
    const res = await axios.get(`${API}/me`, { withCredentials: true });
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    await axios.post(`${API}/register`, { username, email, password }, { withCredentials: true });
    const res = await axios.get(`${API}/me`, { withCredentials: true });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post(`${API}/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
