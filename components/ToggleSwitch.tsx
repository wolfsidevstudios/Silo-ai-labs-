import React from 'react';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, checked, onChange }) => {
  const toggleId = `toggle-${label.replace(/\s+/g, '-')}`;
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0">
      <div>
        <label htmlFor={toggleId} className="font-semibold text-white cursor-pointer">{label}</label>
        {description && <p className="text-sm text-gray-400 max-w-sm">{description}</p>}
      </div>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 ${checked ? 'bg-purple-600' : 'bg-gray-600'}`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
