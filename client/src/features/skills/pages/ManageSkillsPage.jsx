import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import useProfile from '../../profile/hooks/useProfile';
import useSkills from '../hooks/useSkills';
import SkillForm from '../components/SkillForm';
import SkillList from '../components/SkillList';
import './ManageSkillsPage.css';

/**
 * Manage Skills Page
 * Shows SkillForm at top
 * Shows two SkillList sections: "Skills I Offer" and "Skills I Want to Learn"
 * Allows user to remove skills
 */
const ManageSkillsPage = () => {
  const { user } = useAuth();
  const { skills, refetch: refetchProfile, loading: profileLoading } = useProfile(user?.id);
  const { 
    allSkills, 
    loading: skillsLoading, 
    error: skillsError,
    addSkill, 
    removeSkill, 
    actionLoading 
  } = useSkills();

  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddSkill = async (skillData) => {
    setActionError(null);
    setSuccessMessage('');

    const result = await addSkill(skillData);

    if (result.success) {
      setSuccessMessage('Skill added successfully!');
      await refetchProfile();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setActionError(result.error);
    }

    return result;
  };

  const handleRemoveSkill = async (userSkillId) => {
    setActionError(null);
    setSuccessMessage('');

    const result = await removeSkill(userSkillId);

    if (result.success) {
      setSuccessMessage('Skill removed successfully!');
      await refetchProfile();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setActionError(result.error);
    }

    return result;
  };

  if (profileLoading || skillsLoading) {
    return (
      <div className="manage-skills-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  if (skillsError) {
    return (
      <div className="manage-skills-page">
        <div className="error-message">
          <span>Error: {skillsError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-skills-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Manage My Skills</h1>
        <p>Add skills you can teach and skills you want to learn</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span>✓ {successMessage}</span>
        </div>
      )}

      {/* Action Error */}
      {actionError && (
        <div className="error-message">
          <span>{actionError}</span>
          <button 
            className="error-dismiss"
            onClick={() => setActionError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Add Skill Form */}
      <SkillForm 
        allSkills={allSkills} 
        onSubmit={handleAddSkill}
        loading={actionLoading}
      />

      {/* My Skills Sections */}
      <div className="skills-sections">
        {/* Skills I Offer */}
        <section className="skills-section">
          <h2>Skills I Offer ({skills.offered.length})</h2>
          <p className="section-description">
            These are skills you can teach to others
          </p>
          <SkillList
            skills={skills.offered}
            type="offer"
            showLevel={true}
            onRemove={handleRemoveSkill}
            emptyMessage="You haven't added any skills to offer yet. Add one above!"
          />
        </section>

        {/* Skills I Want to Learn */}
        <section className="skills-section">
          <h2>Skills I Want to Learn ({skills.wanted.length})</h2>
          <p className="section-description">
            These are skills you're interested in learning
          </p>
          <SkillList
            skills={skills.wanted}
            type="want"
            showLevel={false}
            onRemove={handleRemoveSkill}
            emptyMessage="You haven't added any skills you want to learn yet. Add one above!"
          />
        </section>
      </div>
    </div>
  );
};

export default ManageSkillsPage;
