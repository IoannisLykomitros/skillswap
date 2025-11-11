import React, { useState } from 'react';
import { sendMentorshipRequest } from '../../../services/mentorshipService';
import { getErrorMessage } from '../../../utils/helpers';
import './SendRequestForm.css';

/**
 * Send Request Form Modal
 * Modal with form to send mentorship request
 * User selects skill and optionally adds message
 */
const SendRequestForm = ({ mentorProfile, mentorSkills, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    skill_id: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.skill_id) {
      setError('Please select a skill');
      return;
    }

    if (formData.message && formData.message.length > 500) {
      setError('Message cannot exceed 500 characters');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        receiver_id: mentorProfile.id,
        skill_id: parseInt(formData.skill_id),
        message: formData.message.trim() || null
      };

      const response = await sendMentorshipRequest(requestData);

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Send Mentorship Request</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="mentor-info">
            <div className="mentor-avatar">
              {mentorProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{mentorProfile.name}</h3>
              <p>Request mentorship from this user</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="request-form">
            {/* Skill Selection */}
            <div className="form-group">
              <label htmlFor="skill_id">Select Skill *</label>
              <select
                id="skill_id"
                name="skill_id"
                value={formData.skill_id}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">-- Choose a skill --</option>
                {mentorSkills.map(skill => (
                  <option key={skill.userSkillId} value={skill.skillId}>
                    {skill.skillName} ({skill.proficiencyLevel})
                  </option>
                ))}
              </select>
              <small className="field-hint">
                Choose which skill you'd like to learn from this mentor
              </small>
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Introduce yourself and explain what you'd like to learn..."
                rows="4"
                disabled={loading}
                maxLength="500"
              />
              <small className="field-hint">
                {formData.message.length}/500 characters
              </small>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendRequestForm;
