import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authedUser } = useContext(AuthContext);

  // Jika pengguna belum login, arahkan ke halaman login
  if (!authedUser) {
    // Navigate adalah komponen dari React Router untuk pengalihan halaman
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan konten halaman yang diminta
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;