import React from 'react';
import './DashboardStats.css';

/**
 * Dashboard Stats Component
 * Displays key statistics about mentorship requests
 */
const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Active Mentorships',
      value: stats.activeMentorships,
      icon: '🤝',
      color: 'stat-green',
      description: 'Currently learning or teaching'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: '⏳',
      color: 'stat-orange',
      description: 'Awaiting response'
    },
    {
      title: 'Completed Sessions',
      value: stats.completedTotal,
      icon: '✅',
      color: 'stat-blue',
      description: 'Successfully finished'
    },
    {
      title: 'Total Requests',
      value: stats.sentTotal + stats.receivedTotal,
      icon: '📊',
      color: 'stat-purple',
      description: 'Sent and received'
    }
  ];

  return (
    <div className="dashboard-stats">
      <h2 className="stats-title">Your Activity Overview</h2>
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
