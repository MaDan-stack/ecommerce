import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { authedUser } = useContext(AuthContext);

  if (!authedUser) {
    return <Navigate to="/login" replace />;
  }

  if (authedUser.role !== 'admin') {
    // Jika login tapi bukan admin, kembalikan ke beranda
    return <Navigate to="/" replace />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;