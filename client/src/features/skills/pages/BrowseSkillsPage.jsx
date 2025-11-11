import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSkills } from '../../../services/skillService';
import { getErrorMessage } from '../../../utils/helpers';
import './BrowseSkillsPage.css';

/**
 * Browse Skills Page
 * Shows all available skills
 * For each skill, shows users who offer it
 * Allows clicking on user to view profile
 */
const BrowseSkillsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching skills with users...');
        const response = await getAllSkills({ include_users: true });
        console.log('Skills response:', response);

        if (response.success) {
            console.log('Skills data:', response.data.skills);
            setSkills(response.data.skills);
        }
        } catch (err) {
        console.error('Error fetching skills:', err);
        setError(getErrorMessage(err));
        } finally {
        setLoading(false);
        }
  };

    fetchSkills();
  }, []);

  const categories = ['all', ...new Set(skills.map(skill => skill.category))];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.skillName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="browse-skills-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="browse-skills-page">
        <div className="error-message">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-skills-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Browse Skills</h1>
        <p>Find mentors for skills you want to learn</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Found <strong>{filteredSkills.length}</strong> skill{filteredSkills.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Skills List */}
      {filteredSkills.length > 0 ? (
        <div className="skills-container">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="skills-grid">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="skill-card">
                    <h3 className="skill-name">{skill.skillName}</h3>
                    <p className="skill-category">{skill.category}</p>
                    
                    {skill.users && skill.users.length > 0 ? (
                      <div className="skill-users">
                        <p className="users-count">
                          {skill.users.length} {skill.users.length === 1 ? 'person offers' : 'people offer'} this skill
                        </p>
                        <div className="users-list">
                          {skill.users.slice(0, 5).map(user => (
                            <div 
                              key={user.userId} 
                              className="user-item"
                              onClick={() => handleViewProfile(user.userId)}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="user-avatar">
                                {user.userName.charAt(0).toUpperCase()}
                              </div>
                              <div className="user-info">
                                <p className="user-name">{user.userName}</p>
                                {user.proficiencyLevel && (
                                  <span className="proficiency-badge">
                                    {user.proficiencyLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {skill.users.length > 5 && (
                            <p className="more-users">
                              +{skill.users.length - 5} more
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="no-users">No mentors available yet</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No skills found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default BrowseSkillsPage;
