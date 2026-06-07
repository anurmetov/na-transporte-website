import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { DatePickerModal } from '../ui/DatePickerModal';
import { scrollToElement } from '../../utils/scroll';

const mileageOptions = [
  '0 - 50.000 km',
  '50.000 - 100.000 km',
  '100.000 - 200.000 km',
  '200.000 - 500.000 km',
  'Über 500.000 km'
];

export const StepData: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();

  // Generate years from current year down to 1980
  const currentYear = new Date().getFullYear();
  const allYears = Array.from(new Array(currentYear - 1980 + 1), (_val, index) => String(currentYear - index));

  const tuevYears = Array.from(new Array(2029 - 2022 + 1), (_val, index) => String(2029 - index));

  const [error, setError] = useState('');
  const [modalMode, setModalMode] = useState<'year' | 'tuev' | null>(null);

  const handleUpdate = (updates: Partial<typeof data>, nextId?: string, delay: number = 100) => {
    updateData(updates);
    setError(''); // clear error when user changes something
    if (nextId) scrollToElement(nextId, delay);
  };

  const handleNext = () => {
    if (!data.year) return setError('Bitte wählen Sie das Jahr der Erstzulassung.');
    if (!data.mileage) return setError('Bitte geben Sie den Kilometerstand an.');
    if (!data.tuevAvailable) return setError('Bitte geben Sie an, ob TÜV/HU vorhanden ist.');
    if (data.tuevAvailable === 'Ja' && (!data.tuevMonth || !data.tuevYear)) {
      return setError('Bitte wählen Sie Monat und Jahr für TÜV/HU aus.');
    }
    if (!data.unfallfrei) return setError('Bitte geben Sie an, ob das Fahrzeug unfallfrei ist.');
    
    setError('');
    nextStep();
  };

  return (
    <StepLayout title="Fahrzeugdaten">
      <div className="space-y-10 max-w-3xl mx-auto text-left">
        
        {/* Erstzulassung */}
        <div id="section-year" className="relative z-30 space-y-3">
          <label className="block text-xl font-bold text-neutral-900 tracking-tight">Jahr der Erstzulassung</label>
          <button 
            type="button"
            onClick={() => setModalMode('year')}
            className="w-full text-left text-lg px-5 py-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white transition-all flex justify-between items-center cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black focus-visible:bg-white"
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${data.year ? 'text-neutral-900' : 'text-neutral-400'}`} />
              <span className={data.year ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}>
                {data.year || 'Jahr auswählen...'}
              </span>
            </div>
          </button>
        </div>

        {/* Kilometerstand */}
        <div id="section-mileage" className="space-y-4">
          <label className="block text-xl font-bold text-neutral-900 tracking-tight">Kilometerstand</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mileageOptions.map(m => (
              <CardButton
                key={m}
                label={m}
                selected={data.mileage === m}
                onClick={() => handleUpdate({ mileage: m }, 'section-tuev')}
                className="py-3 px-2 text-sm"
              />
            ))}
          </div>
        </div>

        {/* TÜV/HU */}
        <div id="section-tuev" className="relative z-20 space-y-4">
          <label className="block text-xl font-bold text-neutral-900 tracking-tight">TÜV/HU vorhanden?</label>
          <div className="grid grid-cols-2 gap-4 max-w-sm mb-4">
            <CardButton
              label="Ja"
              selected={data.tuevAvailable === 'Ja'}
              onClick={() => handleUpdate({ tuevAvailable: 'Ja' }, 'section-tuev-date')}
              className="py-3"
            />
            <CardButton
              label="Nein"
              selected={data.tuevAvailable === 'Nein'}
              onClick={() => handleUpdate({ tuevAvailable: 'Nein', tuevMonth: '', tuevYear: '' }, 'section-unfallfrei')}
              className="py-3"
            />
          </div>

          {data.tuevAvailable === 'Ja' && (
            <div id="section-tuev-date" className="mt-4 animate-in fade-in slide-in-from-top-2">
              <button 
                type="button"
                onClick={() => setModalMode('tuev')}
                className="w-full text-left text-lg px-5 py-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white transition-all flex justify-between items-center cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black focus-visible:bg-white max-w-sm"
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-5 h-5 ${data.tuevMonth && data.tuevYear ? 'text-neutral-900' : 'text-neutral-400'}`} />
                  <span className={data.tuevMonth && data.tuevYear ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}>
                    {data.tuevMonth && data.tuevYear ? `${data.tuevMonth} / ${data.tuevYear}` : 'Datum auswählen...'}
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Unfallfrei */}
        <div id="section-unfallfrei" className="space-y-4">
          <label className="block text-xl font-bold text-neutral-900 tracking-tight">Unfallfrei?</label>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <CardButton
              label="Ja"
              selected={data.unfallfrei === 'Ja'}
              onClick={() => handleUpdate({ unfallfrei: 'Ja' }, 'section-next')}
              className="py-3"
            />
            <CardButton
              label="Nein"
              selected={data.unfallfrei === 'Nein'}
              onClick={() => handleUpdate({ unfallfrei: 'Nein' }, 'section-next')}
              className="py-3"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200 font-medium flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        <div id="section-next" className="pt-8 border-t border-neutral-100 flex justify-end">
          <button
            onClick={handleNext}
            className="group relative flex w-full md:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black px-8 py-4 font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none hover:bg-neutral-900"
          >
            <span>Weiter</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 group-disabled:opacity-50">arrow_forward</span>
          </button>
        </div>

      </div>

      <DatePickerModal
        isOpen={modalMode === 'year'}
        mode="year-only"
        title="Jahr der Erstzulassung"
        yearOptions={allYears}
        initialYear={data.year}
        onClose={() => setModalMode(null)}
        onSelect={(_, y) => handleUpdate({ year: y }, 'section-mileage', 400)}
      />

      <DatePickerModal
        isOpen={modalMode === 'tuev'}
        mode="month-year"
        title="TÜV/HU Datum"
        yearOptions={tuevYears}
        initialMonth={data.tuevMonth}
        initialYear={data.tuevYear}
        onClose={() => setModalMode(null)}
        onSelect={(m, y) => handleUpdate({ tuevMonth: m, tuevYear: y }, 'section-unfallfrei', 400)}
      />

    </StepLayout>
  );
};
