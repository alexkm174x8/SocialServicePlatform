import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const FilterButton = ({ label, options, selectedValues, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    let updatedValues: string[];

    if (selectedValues.includes(value)) {
      updatedValues = selectedValues.filter((v) => v !== value);
    } else {
      updatedValues = [...selectedValues, value];
    }

    onChange(updatedValues);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 border border-blue-900 text-blue-900 font-semibold rounded-full px-4 py-1 text-sm w-[140px] hover:bg-blue-200 transition"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg">
          {options.map((opt) => (
            <label key={opt} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt)}
                onChange={() => toggleValue(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
