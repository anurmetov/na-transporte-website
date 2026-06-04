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
        className={`w-full text-lg p-5 rounded-2xl border-2 transition-all flex justify-between items-center cursor-pointer bg-white shadow-sm hover:shadow-md
          ${isOpen ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200 hover:border-primary/50'}`}
      >
        <div className="flex items-center gap-3">
          {icon && <div className={value ? 'text-primary' : 'text-gray-400'}>{icon}</div>}
          <span className={value ? 'text-gray-900 font-bold' : 'text-gray-400'}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
      </div>

      {isOpen && (
        <div className="hidden md:block">
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-20 w-full mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-72 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
            {options.map(opt => (
              <div 
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-6 py-5 text-xl cursor-pointer transition-colors flex justify-between items-center border-b last:border-b-0 border-gray-50
                  ${value === opt ? 'bg-primary/5 text-primary font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <span>{opt}</span>
                {value === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
