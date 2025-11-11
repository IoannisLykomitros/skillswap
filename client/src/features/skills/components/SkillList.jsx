import React from 'react';
import SkillBadge from './SkillBadge';
import './SkillList.css';

/**
 * Skill List Component
 * Renders array of skills as SkillBadge components
 * Each badge has remove button (if managing own skills)
 */
const SkillList = ({ 
  skills, 
  type, 
  showLevel = false, 
  onRemove = null, 
  emptyMessage = 'No skills added yet' 
}) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="skill-list-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="skill-list">
      {skills.map((skill) => (
        <SkillBadge
          key={skill.userSkillId}
          skill={skill}
          type={type}
          showLevel={showLevel}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default SkillList;
