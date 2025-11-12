import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopSkills } from '../services/skillService';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [topSkills, setTopSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    const fetchTopSkills = async () => {
      try {
        const response = await getTopSkills(8); // Get top 8 skills
        if (response.success) {
          setTopSkills(response.data.skills || []);
        }
      } catch (error) {
        console.error('Error fetching top skills:', error);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchTopSkills();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to SkillSwap</h1>
          <p className="hero-subtitle">
            Connect with mentors and learners to exchange knowledge. 
            Learn new skills, share your expertise, and grow together.
          </p>
          
          {/* Show buttons only if not authenticated */}
          {!isAuthenticated() && (
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Login
              </Link>
            </div>
          )}

          {/* Show personalized content if authenticated */}
          {isAuthenticated() && (
            <div className="cta-buttons">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
              <Link to="/skills" className="btn btn-secondary btn-lg">
                Browse Skills
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How SkillSwap Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Find Mentors</h3>
            <p>Browse profiles and discover mentors who offer the skills you want to learn.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Share Your Skills</h3>
            <p>List skills you can teach and help others learn something new.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Send Requests</h3>
            <p>Connect with mentors by sending mentorship requests with personalized messages.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Track Progress</h3>
            <p>Manage your mentorship relationships and mark completed learning sessions.</p>
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="skills-preview-section">
        <h2 className="section-title">Popular Skills</h2>
        <p className="section-subtitle">
          Explore some of the most sought-after skills on SkillSwap
        </p>

        {loadingSkills ? (
          <div className="skills-loading">
            <div className="spinner"></div>
            <p>Loading skills...</p>
          </div>
        ) : topSkills.length > 0 ? (
          <div className="skills-grid">
            {topSkills.map(skill => (
              <Link 
                to={`/skills?skill=${skill.id}`} 
                key={skill.id} 
                className="skill-preview-card"
              >
                <h4>{skill.skill_name}</h4>
                <p className="skill-category">{skill.category}</p>
                <p className="skill-count">
                  {skill.mentor_count} {skill.mentor_count === 1 ? 'mentor' : 'mentors'}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-skills-message">No skills available yet. Be the first to add one!</p>
        )}

        <div className="browse-all-link">
          <Link to="/skills" className="btn btn-primary">
            Browse All Skills
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2 className="section-title">Join Our Growing Community</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100+</div>
            <div className="stat-label">Skills Shared</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Connections Made</div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      {!isAuthenticated() && (
        <section className="cta-section">
          <h2>Ready to Start Learning?</h2>
          <p>Join SkillSwap today and connect with mentors worldwide</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
