import React from 'react';
import { Navigate } from 'react-router-dom';

const DemoProfile: React.FC = () => {
  return <Navigate to="/demo/settings" replace />;
};

export default DemoProfile;
