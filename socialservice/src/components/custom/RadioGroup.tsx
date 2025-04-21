type RadioGroupProps = {
  label: string;
  options: string[];
  name: string;
};

export const RadioGroup = ({ label, options, name }: RadioGroupProps) => {
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
              className="accent-[#0a2170]"
            />
            <label htmlFor={`${name}-${index}`} className="text-sm text-gray-800">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
