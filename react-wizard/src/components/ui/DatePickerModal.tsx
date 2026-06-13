import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

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
  title
}) => {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  useEffect(() => {
    if (isOpen) {
      setSelectedMonth(initialMonth);
      setSelectedYear(initialYear);

      // Auto-scroll to the selected year button inside the modal
      setTimeout(() => {
        const container = document.getElementById('datepicker-scroll-container');
        if (initialYear) {
          const btn = document.getElementById(`year-btn-${initialYear}`);
          if (btn && container) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else if (mode === 'year-only') {
          // If no year selected, scroll to the top of the container
          if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }, 150);
    }
  }, [isOpen, initialMonth, initialYear, mode]);

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

  const modalContent = (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-white">
          <h2 className="text-xl font-semibold text-neutral-900 break-words text-balance">{title || t('wizard_select_date')}</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-800 transition-colors rounded-lg hover:bg-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div id="datepicker-scroll-container" className="p-6 max-h-[60vh] overflow-y-auto">
          
          {mode === 'month-year' && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-neutral-500 tracking-wider uppercase mb-4">{t('wizard_month')}</h3>
              <div className="grid grid-cols-4 gap-2">
                {monthsList.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`py-2 text-base font-medium rounded-lg transition-all border
                      ${selectedMonth === m 
                        ? 'bg-black text-white border-black shadow-sm' 
                        : 'text-neutral-600 border-transparent hover:bg-neutral-100 hover:border-neutral-200'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-neutral-500 tracking-wider uppercase mb-4">{t('wizard_year')}</h3>
            <div className="grid grid-cols-4 gap-2">
              {yearOptions.map(y => (
                <button
                  key={y}
                  id={`year-btn-${y}`}
                  onClick={() => setSelectedYear(y)}
                  className={`py-2 text-base font-medium rounded-lg transition-all border
                    ${selectedYear === y 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'text-neutral-600 border-transparent hover:bg-neutral-100 hover:border-neutral-200'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 bg-white flex items-center justify-between">
          <button 
            onClick={handleClear}
            className="text-neutral-500 font-medium hover:text-neutral-800 transition-colors px-4 py-2 rounded-lg hover:bg-neutral-100"
          >
            {t('wizard_clear')}
          </button>
          <button
            onClick={handleSelect}
            disabled={!isValid}
            className="bg-black text-white px-6 py-2.5 rounded-lg font-medium text-base disabled:opacity-50 hover:bg-neutral-800 transition-colors shadow-sm"
          >
            {t('wizard_select')}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
