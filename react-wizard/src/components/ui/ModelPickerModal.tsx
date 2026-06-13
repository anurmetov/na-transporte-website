import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export type ModelGroup = { group: string; options: string[] };

interface ModelPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: string) => void;
  options: ModelGroup[];
  initialValue?: string;
  title?: string;
}

export const ModelPickerModal: React.FC<ModelPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  options,
  initialValue = '',
  title
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setSelectedValue(initialValue);
      setTimeout(() => {
        const container = document.getElementById('modelpicker-scroll-container');
        if (initialValue) {
          const btn = document.getElementById(`model-btn-${initialValue.replace(/[\s\(\)]+/g, '-')}`);
          if (btn && container) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }, 150);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSelect = () => {
    if (!selectedValue) return;
    onSelect(selectedValue);
    onClose();
  };

  const handleClear = () => {
    setSelectedValue('');
    onSelect('');
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-white">
          <h2 className="text-xl font-semibold text-neutral-900 break-words text-balance">{title || t('wizard_select_model')}</h2>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-800 transition-colors rounded-lg hover:bg-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div id="modelpicker-scroll-container" className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {options.map((g, i) => (
            <div key={i}>
              {g.group !== 'Andere' && (
                <h3 className="text-xs font-semibold text-neutral-500 tracking-wider uppercase mb-3">
                  {g.group === 'Andere Modelle' ? t('model_other_models') : g.group.replace('(Alle)', `(${t('model_all')})`)}
                </h3>
              )}
              <div className="grid grid-cols-2 gap-2">
                {g.options.map(opt => (
                  <button
                    key={opt}
                    id={`model-btn-${opt.replace(/[\s\(\)]+/g, '-')}`}
                    onClick={() => setSelectedValue(opt)}
                    className={`py-3 px-2 text-sm font-medium rounded-lg transition-all border break-words hyphens-auto
                      ${selectedValue === opt 
                        ? 'bg-black text-white border-black shadow-sm' 
                        : 'text-neutral-600 border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300'}`}
                  >
                    {opt === 'Andere' ? t('brand_other') : opt.replace('(Alle)', `(${t('model_all')})`)}
                  </button>
                ))}
              </div>
            </div>
          ))}
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
            disabled={!selectedValue}
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
