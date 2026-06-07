import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-20">
      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30 md:hidden"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(false);
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>

      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-lg p-5 rounded-2xl border transition-all flex justify-between items-center cursor-pointer bg-white shadow-sm outline-none
          ${isOpen ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className={value ? 'text-neutral-900' : 'text-neutral-400'}>{icon}</div>}
          <span className={value ? 'text-neutral-900 font-medium' : 'text-neutral-500'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-neutral-900' : 'text-neutral-400'}`} />
      </div>

      {isOpen && (
        <div className="hidden md:block">
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-20 w-full mt-2 bg-white border border-neutral-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
            {options.map(opt => (
              <div 
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-6 py-4 text-lg cursor-pointer transition-colors flex justify-between items-center
                  ${value === opt ? 'bg-neutral-50 text-neutral-900 font-medium' : 'hover:bg-neutral-50 text-neutral-600'}`}
              >
                <span>{opt}</span>
                {value === opt && <div className="w-2 h-2 rounded-full bg-neutral-900" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
