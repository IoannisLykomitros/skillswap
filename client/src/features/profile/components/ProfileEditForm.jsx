import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../../services/profileService';
import { getErrorMessage } from '../../../utils/helpers';
import './ProfileEditForm.css';

/**
 * Profile Edit Form Component
 * Form with inputs for name, bio, location
 * Handles form submission and updates profile
 */
const ProfileEditForm = ({ profile, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (formData.bio && formData.bio.length > 500) {
      setError('Bio cannot exceed 500 characters');
      return;
    }

    if (formData.location && formData.location.length > 100) {
      setError('Location cannot exceed 100 characters');
      return;
    }

    try {
        const response = await updateProfile({
            name: formData.name.trim(),
            bio: formData.bio.trim() || null,
            location: formData.location.trim() || null
        });

        console.log('API response:', response); 

        if (response.success) {
            setSuccess(true);
            
            if (onSuccess) {
            setTimeout(() => {
                const updatedProfile = response.data || response.profile || {
                name: formData.name.trim(),
                bio: formData.bio.trim(),
                location: formData.location.trim()
                };
                console.log('Passing to onSuccess:', updatedProfile); 
                onSuccess(updatedProfile);
            }, 1500);
            }
        }
    } catch (err) {
    console.error('Update error:', err);
    setError(getErrorMessage(err));
    } finally {
    setLoading(false);
    }
  };

  return (
    <div className="profile-edit-form-container">
      <form onSubmit={handleSubmit} className="profile-edit-form">
        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span>✓ Profile updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button 
              type="button"
              className="error-dismiss"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={loading}
            required
          />
          <small className="field-hint">Your display name (2-100 characters)</small>
        </div>

        {/* Bio Field */}
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself, your interests, and what you're passionate about..."
            rows="5"
            disabled={loading}
            maxLength="500"
          />
          <small className="field-hint">
            {formData.bio.length}/500 characters
          </small>
        </div>

        {/* Location Field */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., New York, USA"
            disabled={loading}
          />
          <small className="field-hint">Your city or region (optional)</small>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
