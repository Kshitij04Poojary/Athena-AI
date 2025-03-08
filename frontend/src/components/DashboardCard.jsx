import React from 'react';
import { motion } from 'framer-motion';
import "../pages/VideoConferencing/Style.css";

const DashboardCard = ({ children, className = "",category }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`dashboard-card ${category} ${className} relative overflow-hidden`}
    >
      {children}
    </motion.div>
  );
};

export default DashboardCard;
