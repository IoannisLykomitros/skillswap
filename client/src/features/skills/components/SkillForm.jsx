import React, { useState } from 'react';
import './SkillForm.css';

/**
 * Skill Form Component
 * Dropdown to select skill from all available skills
 * Radio buttons to select type (offer or want)
 * Submit button to add skill
 */
const SkillForm = ({ allSkills, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    skill_id: '',
    type: 'offer',
    proficiency_level: 'intermediate'
  });
  const [error, setError] = useState('');

  const handleSkillChange = (e) => {
    setFormData(prev => ({
      ...prev,
      skill_id: e.target.value
    }));
    if (error) setError('');
  };

  const handleTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value
    }));
  };

  const handleProficiencyChange = (e) => {
    setFormData(prev => ({
      ...prev,
      proficiency_level: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.skill_id) {
      setError('Please select a skill');
      return;
    }

    const skillData = {
      skill_id: parseInt(formData.skill_id),
      type: formData.type
    };

    if (formData.type === 'offer') {
      skillData.proficiency_level = formData.proficiency_level;
    }

    const result = await onSubmit(skillData);

    if (result && result.success) {
      setFormData({
        skill_id: '',
        type: 'offer',
        proficiency_level: 'intermediate'
      });
    } else if (result && result.error) {
      setError(result.error);
    }
  };

  const getSkillsByCategory = () => {
    const grouped = {};
    allSkills.forEach(skill => {
      const category = skill.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });
    return grouped;
  };

  const skillsByCategory = getSkillsByCategory();

console.log('All skills:', allSkills);
console.log('Skills by category:', skillsByCategory);

  return (
    <div className="skill-form-container">
      <h3>Add a New Skill</h3>
      
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button 
            className="error-dismiss"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="skill-form">
        {/* Skill Selection */}
        <div className="form-group">
          <label htmlFor="skill_id">Select Skill *</label>
          <select
            id="skill_id"
            name="skill_id"
            value={formData.skill_id}
            onChange={handleSkillChange}
            disabled={loading}
            required
          >
            <option value="">-- Choose a skill --</option>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <optgroup key={category} label={category}>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.skillName}  
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <small className="field-hint">
            Select the skill you want to add to your profile
          </small>
        </div>

        {/* Type Selection */}
        <div className="form-group">
          <label>Type *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="offer"
                checked={formData.type === 'offer'}
                onChange={handleTypeChange}
                disabled={loading}
              />
              <span className="radio-text">
                <strong>I can teach this skill</strong>
                Share your expertise with others
              </span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="want"
                checked={formData.type === 'want'}
                onChange={handleTypeChange}
                disabled={loading}
              />
              <span className="radio-text">
                <strong>I want to learn this skill</strong>
                Find mentors to help you learn
              </span>
            </label>
          </div>
        </div>

        {/* Proficiency Level (only for offer) */}
        {formData.type === 'offer' && (
          <div className="form-group">
            <label htmlFor="proficiency_level">Proficiency Level</label>
            <select
              id="proficiency_level"
              name="proficiency_level"
              value={formData.proficiency_level}
              onChange={handleProficiencyChange}
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary btn-full-width"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Skill'}
        </button>
      </form>
    </div>
  );
};

export default SkillForm;
