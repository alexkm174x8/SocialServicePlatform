type RadioGroupProps = {
  label: string;
  options: string[];
  name: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export const RadioGroup = ({ 
  label, 
  options, 
  name, 
  value,
  disabled = false,
  onChange 
}: RadioGroupProps) => {
  return (
    <div className="">
      <label className="block font-bold text-sm text-[#0a2170]">{label} *</label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="radio"
              id={`${name}-${index}`}
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={`accent-[#0a2170] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <label 
              htmlFor={`${name}-${index}`} 
              className={`text-sm text-gray-800 ${disabled ? 'opacity-50' : ''}`}
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
