import React from 'react';
import './SkillBadge.css';

/**
 * Skill Badge Component
 * Small pill-style component showing skill name
 * Different colors for "offered" vs "wanted" skills
 */
const SkillBadge = ({ skill, type, showLevel = false, onRemove = null }) => {
  return (
    <span className={`skill-badge skill-badge-${type}`}>
      <span className="skill-badge-content">
        <span className="skill-name">{skill.skillName}</span>
        {showLevel && skill.proficiencyLevel && (
          <span className="skill-level">· {skill.proficiencyLevel}</span>
        )}
      </span>
      {onRemove && (
        <button
          className="skill-badge-remove"
          onClick={() => onRemove(skill.userSkillId)}
          aria-label={`Remove ${skill.skillName}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
