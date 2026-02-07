import type { ConstraintType } from '../types';
import { CONSTRAINTS } from '../lib/containers';

interface ConstraintBadgeProps {
  type: ConstraintType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ConstraintBadge({ type, size = 'md', showLabel = true }: ConstraintBadgeProps) {
  const constraint = CONSTRAINTS[type];

  const sizeClasses = size === 'sm'
    ? 'text-xs px-1.5 py-0.5'
    : 'text-sm px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeClasses}`}
      style={{ backgroundColor: `${constraint.color}20`, color: constraint.color }}
      title={constraint.description}
    >
      <span>{constraint.icon}</span>
      {showLabel && <span>{constraint.label}</span>}
    </span>
  );
}

interface ConstraintSelectorProps {
  selected: ConstraintType[];
  onChange: (constraints: ConstraintType[]) => void;
}

export function ConstraintSelector({ selected, onChange }: ConstraintSelectorProps) {
  const toggleConstraint = (type: ConstraintType) => {
    if (selected.includes(type)) {
      onChange(selected.filter(c => c !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(CONSTRAINTS).map((constraint) => (
        <button
          key={constraint.type}
          type="button"
          onClick={() => toggleConstraint(constraint.type)}
          className={`inline-flex items-center gap-1 rounded-full text-sm px-3 py-1.5 transition-all border ${
            selected.includes(constraint.type)
              ? 'border-transparent'
              : 'border-slate-600 opacity-50 hover:opacity-80'
          }`}
          style={{
            backgroundColor: selected.includes(constraint.type)
              ? `${constraint.color}30`
              : 'transparent',
            color: constraint.color
          }}
          title={constraint.description}
        >
          <span>{constraint.icon}</span>
          <span>{constraint.label}</span>
        </button>
      ))}
    </div>
  );
}
