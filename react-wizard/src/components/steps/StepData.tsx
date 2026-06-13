import React, { useState } from 'react';
import { Calendar, Car } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../hooks/useTranslation';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { DatePickerModal } from '../ui/DatePickerModal';
import { ModelPickerModal } from '../ui/ModelPickerModal';
import { scrollToElement } from '../../utils/scroll';

const defaultMileageOptions = [
  '0 - 50.000 km',
  '50.000 - 100.000 km',
  '100.000 - 200.000 km',
  '200.000 - 500.000 km',
  'Über 500.000 km'
];

const pkwMileageOptions = [
  '0 - 50.000 km',
  '50.000 - 100.000 km',
  '100.000 - 200.000 km',
  'Über 200.000 km'
];

const lkwMileageOptions = [
  '0 - 50.000 km',
  '50.000 - 100.000 km',
  '100.000 - 200.000 km',
  '200.000 - 1.000.000 km'
];

export type ModelGroup = { group: string; options: string[] };

const carModels: Record<string, ModelGroup[]> = {
  'Volkswagen': [
    { group: 'Golf', options: ['Golf (Alle)', 'Golf', 'Golf Plus', 'Golf Sportsvan', 'Golf Variant', 'e-Golf'] },
    { group: 'Passat', options: ['Passat (Alle)', 'Passat', 'Passat CC', 'Passat Variant'] },
    { group: 'Polo', options: ['Polo (Alle)', 'Polo'] },
    { group: 'Tiguan', options: ['Tiguan (Alle)', 'Tiguan', 'Tiguan Allspace'] },
    { group: 'Touareg', options: ['Touareg (Alle)', 'Touareg'] },
    { group: 'Andere Modelle', options: ['Arteon', 'Caddy', 'Crafter', 'Multivan', 'T-Roc', 'Touran', 'Transporter', 'Up!'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'BMW': [
    { group: '1er Reihe', options: ['1er Reihe (Alle)', '114', '116', '118', '120', '125', '135'] },
    { group: '2er Reihe', options: ['2er Reihe (Alle)', '214 Active Tourer', '216', '218', '220', 'M2'] },
    { group: '3er Reihe', options: ['3er Reihe (Alle)', '316', '318', '320', '325', '330', '335', '340'] },
    { group: '4er Reihe', options: ['4er Reihe (Alle)', '420', '428', '430', '435', '440'] },
    { group: '5er Reihe', options: ['5er Reihe (Alle)', '518', '520', '525', '530', '535', '540', '550'] },
    { group: 'X-Reihe', options: ['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'] },
    { group: 'Andere Modelle', options: ['6er', '7er', '8er', 'Z4', 'i3', 'i4', 'iX'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Mercedes-Benz': [
    { group: 'A-Klasse', options: ['A-Klasse (Alle)', 'A 160', 'A 180', 'A 200', 'A 220', 'A 250'] },
    { group: 'C-Klasse', options: ['C-Klasse (Alle)', 'C 180', 'C 200', 'C 220', 'C 250', 'C 300'] },
    { group: 'E-Klasse', options: ['E-Klasse (Alle)', 'E 200', 'E 220', 'E 250', 'E 300', 'E 350'] },
    { group: 'S-Klasse', options: ['S-Klasse (Alle)', 'S 350', 'S 400', 'S 500'] },
    { group: 'SUVs', options: ['GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Klasse'] },
    { group: 'Transporter / Vans', options: ['V-Klasse', 'Sprinter', 'Vito', 'Citan'] },
    { group: 'Andere Modelle', options: ['B-Klasse', 'CLA', 'CLS'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Audi': [
    { group: 'A3', options: ['A3 (Alle)', 'A3', 'A3 Sportback', 'A3 Limousine'] },
    { group: 'A4', options: ['A4 (Alle)', 'A4', 'A4 Avant', 'A4 allroad'] },
    { group: 'A6', options: ['A6 (Alle)', 'A6', 'A6 Avant', 'A6 allroad'] },
    { group: 'Q-Reihe', options: ['Q2', 'Q3', 'Q5', 'Q7', 'Q8'] },
    { group: 'Andere Modelle', options: ['A1', 'A5', 'A7', 'A8', 'TT', 'e-tron'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Ford': [
    { group: 'Focus', options: ['Focus (Alle)', 'Focus', 'Focus Turnier'] },
    { group: 'Fiesta', options: ['Fiesta (Alle)', 'Fiesta'] },
    { group: 'SUVs', options: ['Kuga', 'Puma', 'Edge', 'Explorer'] },
    { group: 'Transporter', options: ['Transit', 'Tourneo', 'Ranger'] },
    { group: 'Andere Modelle', options: ['Mondeo', 'Mustang', 'S-MAX', 'Galaxy'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Opel': [
    { group: 'Astra', options: ['Astra (Alle)', 'Astra', 'Astra Sports Tourer'] },
    { group: 'Corsa', options: ['Corsa (Alle)', 'Corsa'] },
    { group: 'SUVs', options: ['Mokka', 'Crossland', 'Grandland'] },
    { group: 'Transporter', options: ['Combo', 'Vivaro', 'Movano'] },
    { group: 'Andere Modelle', options: ['Insignia', 'Zafira', 'Adam'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Skoda': [
    { group: 'Octavia', options: ['Octavia (Alle)', 'Octavia', 'Octavia Combi'] },
    { group: 'Fabia', options: ['Fabia (Alle)', 'Fabia', 'Fabia Combi'] },
    { group: 'SUVs', options: ['Kamiq', 'Karoq', 'Kodiaq', 'Enyaq'] },
    { group: 'Andere Modelle', options: ['Superb', 'Scala', 'Citigo'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Porsche': [
    { group: '911', options: ['911 (Alle)', '911 Carrera', '911 Turbo', '911 GT3'] },
    { group: 'SUVs', options: ['Macan', 'Cayenne'] },
    { group: 'Andere Modelle', options: ['Panamera', 'Taycan', 'Boxster', 'Cayman'] },
    { group: 'Andere', options: ['Andere'] }
  ]
};

const truckModels: Record<string, ModelGroup[]> = {
  'Mercedes-Benz': [
    { group: 'Actros', options: ['Actros (Alle)', 'Actros 1845', 'Actros 1848', 'Actros 1851'] },
    { group: 'Arocs', options: ['Arocs (Alle)', 'Arocs 3240', 'Arocs 4145'] },
    { group: 'Atego', options: ['Atego (Alle)', 'Atego 815', 'Atego 1222'] },
    { group: 'Transporter', options: ['Sprinter', 'Vito'] },
    { group: 'Andere Modelle', options: ['Econic', 'Unimog', 'Zetros'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'MAN': [
    { group: 'TGX', options: ['TGX (Alle)', 'TGX 18.470', 'TGX 18.510', 'TGX 26.470'] },
    { group: 'TGS', options: ['TGS (Alle)', 'TGS 18.400', 'TGS 26.440'] },
    { group: 'Andere Modelle', options: ['TGM', 'TGL', 'TGE'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Volvo': [
    { group: 'FH', options: ['FH (Alle)', 'FH 460', 'FH 500', 'FH 540'] },
    { group: 'FM', options: ['FM (Alle)', 'FM 420', 'FM 460'] },
    { group: 'Andere Modelle', options: ['FH16', 'FMX', 'FE', 'FL'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Scania': [
    { group: 'R-Serie', options: ['R-Serie (Alle)', 'R 450', 'R 500', 'R 520'] },
    { group: 'S-Serie', options: ['S-Serie (Alle)', 'S 500', 'S 540', 'S 580'] },
    { group: 'Andere Modelle', options: ['G-Serie', 'P-Serie', 'L-Serie'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'DAF': [
    { group: 'XF', options: ['XF (Alle)', 'XF 480', 'XF 530'] },
    { group: 'XG / XG+', options: ['XG (Alle)', 'XG 480', 'XG+ 530'] },
    { group: 'Andere Modelle', options: ['CF', 'LF'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Iveco': [
    { group: 'S-Way', options: ['S-Way (Alle)', 'S-Way 460', 'S-Way 510'] },
    { group: 'Daily', options: ['Daily (Alle)', 'Daily 35S14', 'Daily 35C15'] },
    { group: 'Andere Modelle', options: ['X-Way', 'T-Way', 'Eurocargo', 'Stralis', 'Trakker'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Renault': [
    { group: 'T-Baureihe', options: ['T-Baureihe (Alle)', 'T 480', 'T 520', 'T High'] },
    { group: 'Transporter', options: ['Master', 'Trafic'] },
    { group: 'Andere Modelle', options: ['C-Baureihe', 'K-Baureihe', 'D-Baureihe'] },
    { group: 'Andere', options: ['Andere'] }
  ],
  'Ford': [
    { group: 'F-Max', options: ['F-Max (Alle)', 'F-Max 500'] },
    { group: 'Transporter', options: ['Transit', 'Transit Custom'] },
    { group: 'Andere Modelle', options: ['Cargo'] },
    { group: 'Andere', options: ['Andere'] }
  ]
};

export const StepData: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const { t } = useTranslation();

  // Generate years from current year down to 1980
  const currentYear = new Date().getFullYear();
  const allYears = Array.from(new Array(currentYear - 1980 + 1), (_val, index) => String(currentYear - index));

  const tuevYears = Array.from(new Array(2029 - 2022 + 1), (_val, index) => String(2029 - index));

  const [error, setError] = useState('');
  const [modalMode, setModalMode] = useState<'year' | 'tuev' | 'model' | null>(null);
  
  const needsModel = ['pkw', 'lkw', 'szm'].includes(data.vehicleType);
  const availableModelGroups = data.vehicleType === 'pkw' ? carModels[data.brand] : truckModels[data.brand];

  // Helper to check if a model exists in the groups
  const isModelInGroups = (model: string, groups?: ModelGroup[]) => {
    if (!groups) return false;
    return groups.some(g => g.options.includes(model));
  };

  const [customModel, setCustomModel] = useState(data.model && !isModelInGroups(data.model, availableModelGroups) ? data.model : '');

  const handleUpdate = (updates: Partial<typeof data>, nextId?: string, delay: number = 100) => {
    updateData(updates);
    setError(''); // clear error when user changes something
    if (nextId) scrollToElement(nextId, delay);
  };

  const isTrailer = data.vehicleType === 'auflieger' || data.vehicleType === 'anhaenger';

  const handleNext = () => {
    if (needsModel && !data.model) return setError(t('err_model'));
    if (data.model === 'Andere' && !customModel.trim()) return setError(t('err_model_custom'));
    if (!data.year) return setError(t('err_year'));
    if (!isTrailer) {
      if (!data.mileage) return setError(t('err_mileage'));
      if (!data.tuevAvailable) return setError(t('err_tuev'));
      if (data.tuevAvailable === 'Ja' && (!data.tuevMonth || !data.tuevYear)) {
        return setError(t('err_tuev_date'));
      }
      if (!data.unfallfrei) return setError(t('err_accident'));
    }
    
    if (needsModel && data.model === 'Andere') {
      updateData({ model: customModel });
    }
    setError('');
    nextStep();
  };

  return (
    <StepLayout title={t('step_data')}>
      <div className="space-y-10 max-w-3xl mx-auto text-left">
        
        {/* Modell */}
        {needsModel && (
          <div id="section-model" className="relative z-40 space-y-3">
            <label className="block text-xl font-bold text-neutral-900 tracking-tight">{t('data_model')}</label>
            {availableModelGroups && availableModelGroups.length > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={() => setModalMode('model')}
                  className="flex-1 text-left text-lg px-5 py-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white transition-all flex justify-between items-center cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black focus-visible:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Car className={`w-5 h-5 ${data.model && data.model !== 'Andere' ? 'text-neutral-900' : 'text-neutral-400'}`} />
                    <span className={data.model && data.model !== 'Andere' ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}>
                      {data.model === 'Andere' 
                        ? t('brand_other') 
                        : (data.model === customModel && data.model !== '' && !isModelInGroups(data.model, availableModelGroups) 
                            ? t('brand_other') 
                            : (data.model ? data.model.replace('(Alle)', `(${t('model_all')})`) : t('data_model_select')))}
                    </span>
                  </div>
                </button>
                {(data.model === 'Andere' || (data.model && !isModelInGroups(data.model, availableModelGroups))) && (
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder={t('data_model_custom')}
                    className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-black focus:border-black"
                  />
                )}
              </div>
            ) : (
              <input
                type="text"
                value={data.model}
                onChange={(e) => handleUpdate({ model: e.target.value }, undefined, 0)}
                placeholder={t('data_model_custom')}
                className="w-full text-left text-lg px-5 py-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black focus-visible:bg-white"
              />
            )}
          </div>
        )}

        {/* Erstzulassung */}
        <div id="section-year" className="relative z-30 space-y-3">
          <label className="block text-xl font-bold text-neutral-900 tracking-tight">{t('data_year')}</label>
          <button 
            type="button"
            onClick={() => setModalMode('year')}
            className="w-full text-left text-lg px-5 py-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white transition-all flex justify-between items-center cursor-pointer shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black focus-visible:bg-white"
          >
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${data.year ? 'text-neutral-900' : 'text-neutral-400'}`} />
              <span className={data.year ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}>
                {data.year || t('data_year_select')}
              </span>
            </div>
          </button>
        </div>

        {/* Kilometerstand */}
        {!isTrailer && (
          <div id="section-mileage" className="space-y-4">
            <label className="block text-xl font-bold text-neutral-900 tracking-tight">{t('data_mileage')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(data.vehicleType === 'pkw' ? pkwMileageOptions : (data.vehicleType === 'lkw' ? lkwMileageOptions : defaultMileageOptions)).map(m => (
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
        )}

        {/* TÜV/HU */}
        {!isTrailer && (
          <div id="section-tuev" className="relative z-20 space-y-4">
            <label className="block text-xl font-bold text-neutral-900 tracking-tight">{t('data_tuev')}</label>
            <div className="grid grid-cols-2 gap-4 max-w-sm mb-4">
              <CardButton
                label={t('data_yes')}
                selected={data.tuevAvailable === 'Ja'}
                onClick={() => handleUpdate({ tuevAvailable: 'Ja' }, 'section-tuev-date')}
                className="py-3"
              />
              <CardButton
                label={t('data_no')}
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
                      {data.tuevMonth && data.tuevYear ? `${data.tuevMonth} / ${data.tuevYear}` : t('data_date_select')}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Unfallfrei */}
        {!isTrailer && (
          <div id="section-unfallfrei" className="space-y-4">
            <label className="block text-xl font-bold text-neutral-900 tracking-tight">{t('data_accident_free')}</label>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <CardButton
                label={t('data_yes')}
                selected={data.unfallfrei === 'Ja'}
                onClick={() => handleUpdate({ unfallfrei: 'Ja' }, 'section-next')}
                className="py-3"
              />
              <CardButton
                label={t('data_no')}
                selected={data.unfallfrei === 'Nein'}
                onClick={() => handleUpdate({ unfallfrei: 'Nein' }, 'section-next')}
                className="py-3"
              />
            </div>
          </div>
        )}

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
            <span>{t('wizard_next')}</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 group-disabled:opacity-50">arrow_forward</span>
          </button>
        </div>

      </div>

      <DatePickerModal
        isOpen={modalMode === 'year'}
        mode="year-only"
        title={t('data_year')}
        yearOptions={allYears}
        initialYear={data.year}
        onClose={() => setModalMode(null)}
        onSelect={(_, y) => handleUpdate({ year: y }, 'section-mileage', 400)}
      />

      <DatePickerModal
        isOpen={modalMode === 'tuev'}
        onClose={() => setModalMode(null)}
        onSelect={(month, year) => handleUpdate({ tuevMonth: month, tuevYear: year }, 'section-unfallfrei')}
        mode="month-year"
        initialMonth={data.tuevMonth}
        initialYear={data.tuevYear}
        yearOptions={tuevYears}
        title={t('data_tuev_until')}
      />

      {needsModel && availableModelGroups && availableModelGroups.length > 0 && (
        <ModelPickerModal
          isOpen={modalMode === 'model'}
          onClose={() => setModalMode(null)}
          onSelect={(model) => {
            handleUpdate({ model }, model === 'Andere' ? undefined : 'section-year');
            if (model !== 'Andere') setCustomModel('');
          }}
          options={availableModelGroups}
          initialValue={data.model === customModel && data.model !== '' && !isModelInGroups(data.model, availableModelGroups) ? 'Andere' : data.model}
        />
      )}

    </StepLayout>
  );
};
