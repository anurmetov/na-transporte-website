import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (month: string, year: string) => void;
  mode: 'year-only' | 'month-year';
  initialMonth?: string;
  initialYear?: string;
  yearOptions: string[];
  title?: string;
}

const monthsList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  mode,
  initialMonth = '',
  initialYear = '',
  yearOptions,
  title = "Datum wählen"
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  useEffect(() => {
    if (isOpen) {
      setSelectedMonth(initialMonth);
      setSelectedYear(initialYear);
    }
  }, [isOpen, initialMonth, initialYear]);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (mode === 'month-year' && (!selectedMonth || !selectedYear)) return;
    if (mode === 'year-only' && !selectedYear) return;
    onSelect(selectedMonth, selectedYear);
    onClose();
  };

  const handleClear = () => {
    setSelectedMonth('');
    setSelectedYear('');
    onSelect('', '');
    onClose();
  };

  const isValid = mode === 'month-year' ? (selectedMonth && selectedYear) : selectedYear;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {mode === 'month-year' && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Monat</h3>
              <div className="grid grid-cols-4 gap-2">
                {monthsList.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`py-3 text-lg font-medium rounded-xl transition-all
                      ${selectedMonth === m 
                        ? 'bg-[#b33900] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-200 bg-transparent'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-4">Jahr</h3>
            <div className="grid grid-cols-4 gap-2">
              {yearOptions.map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`py-3 text-lg font-medium rounded-xl transition-all
                    ${selectedYear === y 
                      ? 'bg-[#b33900] text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-200 bg-transparent'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between">
          <button 
            onClick={handleClear}
            className="text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Löschen
          </button>
          <button
            onClick={handleSelect}
            disabled={!isValid}
            className="bg-[#b33900] text-white px-8 py-3 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-[#9a3100] transition-colors shadow-md"
          >
            Auswählen
          </button>
        </div>

      </div>
    </div>
  );
};
