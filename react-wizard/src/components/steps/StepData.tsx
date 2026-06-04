import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { DatePickerModal } from '../ui/DatePickerModal';

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

  const handleUpdate = (updates: Partial<typeof data>) => {
    updateData(updates);
    setError(''); // clear error when user changes something
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
        <div className="relative z-30">
          <label className="block text-xl font-bold text-gray-900 mb-4">Jahr der Erstzulassung</label>
          <div 
            onClick={() => setModalMode('year')}
            className="w-full text-lg p-5 rounded-2xl border-2 border-gray-200 hover:border-primary/50 transition-all flex justify-between items-center cursor-pointer bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-6 h-6 ${data.year ? 'text-primary' : 'text-gray-400'}`} />
              <span className={data.year ? 'text-gray-900 font-bold' : 'text-gray-400'}>
                {data.year || 'Jahr auswählen...'}
              </span>
            </div>
          </div>
        </div>

        {/* Kilometerstand */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4">Kilometerstand</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mileageOptions.map(m => (
              <CardButton
                key={m}
                label={m}
                selected={data.mileage === m}
                onClick={() => handleUpdate({ mileage: m })}
                className="py-3 px-2 text-sm"
              />
            ))}
          </div>
        </div>

        {/* TÜV/HU */}
        <div className="relative z-20">
          <label className="block text-xl font-bold text-gray-900 mb-4">TÜV/HU vorhanden?</label>
          <div className="grid grid-cols-2 gap-4 max-w-sm mb-4">
            <CardButton
              label="Ja"
              selected={data.tuevAvailable === 'Ja'}
              onClick={() => handleUpdate({ tuevAvailable: 'Ja' })}
              className="py-3"
            />
            <CardButton
              label="Nein"
              selected={data.tuevAvailable === 'Nein'}
              onClick={() => handleUpdate({ tuevAvailable: 'Nein', tuevMonth: '', tuevYear: '' })}
              className="py-3"
            />
          </div>

          {data.tuevAvailable === 'Ja' && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <div 
                onClick={() => setModalMode('tuev')}
                className="w-full text-lg p-5 rounded-2xl border-2 border-gray-200 hover:border-primary/50 transition-all flex justify-between items-center cursor-pointer bg-white shadow-sm hover:shadow-md max-w-sm"
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-6 h-6 ${data.tuevMonth && data.tuevYear ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={data.tuevMonth && data.tuevYear ? 'text-gray-900 font-bold' : 'text-gray-400'}>
                    {data.tuevMonth && data.tuevYear ? `${data.tuevMonth} / ${data.tuevYear}` : 'Datum auswählen...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Unfallfrei */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4">Unfallfrei?</label>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <CardButton
              label="Ja"
              selected={data.unfallfrei === 'Ja'}
              onClick={() => handleUpdate({ unfallfrei: 'Ja' })}
              className="py-3"
            />
            <CardButton
              label="Nein"
              selected={data.unfallfrei === 'Nein'}
              onClick={() => handleUpdate({ unfallfrei: 'Nein' })}
              className="py-3"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="pt-6 border-t flex justify-end">
          <button
            onClick={handleNext}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          >
            Weiter
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
        onSelect={(_, y) => handleUpdate({ year: y })}
      />

      <DatePickerModal
        isOpen={modalMode === 'tuev'}
        mode="month-year"
        title="TÜV/HU Datum"
        yearOptions={tuevYears}
        initialMonth={data.tuevMonth}
        initialYear={data.tuevYear}
        onClose={() => setModalMode(null)}
        onSelect={(m, y) => handleUpdate({ tuevMonth: m, tuevYear: y })}
      />

    </StepLayout>
  );
};
