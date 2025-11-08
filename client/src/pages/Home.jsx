import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to SkillSwap</h1>
      <p>Connect with mentors and learners to exchange skills</p>
      <div className="cta-buttons">
        <a href="/register" className="btn btn-primary">Get Started</a>
        <a href="/login" className="btn btn-secondary">Login</a>
      </div>
    </div>
  );
};

export default Home;
