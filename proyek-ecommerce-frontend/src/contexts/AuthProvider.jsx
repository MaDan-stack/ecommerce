import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext'; // Import Context
import { getUserLogged, putAccessToken, login as apiLogin, register as apiRegister } from '../utils/api';

export const AuthProvider = ({ children }) => {
  const [authedUser, setAuthedUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const { data } = await getUserLogged();
        if (data) {
          setAuthedUser(data);
        }
      } catch (error) {
        console.error("Gagal memvalidasi sesi login:", error);     
      } finally {
        setInitializing(false);
      }
    }
    checkLoginStatus();
  }, []);

  const login = async ({ email, password }) => {
    const { error, data } = await apiLogin({ email, password });
    
    if (!error) {
      putAccessToken(data.accessToken);
      const userResponse = await getUserLogged();
      
      if (!userResponse.error && userResponse.data) {
        setAuthedUser(userResponse.data);
        return { error: false, role: userResponse.data.role };
      }
    }
    return { error: true };
  };

  const logout = () => {
    setAuthedUser(null);
    putAccessToken('');
  };

  const register = async (userData) => {
    const { error } = await apiRegister(userData);
    return { error };
  };

  const authContextValue = useMemo(() => ({
    authedUser,
    initializing,
    login,
    logout,
    register,
  }), [authedUser, initializing]);

  if (initializing) {
      return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};