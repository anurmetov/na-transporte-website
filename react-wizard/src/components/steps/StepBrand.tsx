import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../hooks/useTranslation';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { scrollToElement } from '../../utils/scroll';

const carBrands = ['Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Ford', 'Opel', 'Skoda', 'Porsche', 'Andere'];
const truckBrands = ['Mercedes-Benz', 'MAN', 'Volvo', 'Scania', 'DAF', 'Iveco', 'Renault', 'Ford', 'Andere'];
const trailerBrands = ['Schmitz Cargobull', 'Krone', 'Kögel', 'Schwarzmüller', 'Kässbohrer', 'Fliegl', 'Wielton', 'Humbaur', 'Andere'];

const brandDomains: Record<string, string> = {
  'Volkswagen': 'volkswagen.de',
  'BMW': 'bmw.de',
  'Mercedes-Benz': 'mercedes-benz.com',
  'Audi': 'audi.de',
  'Ford': 'ford.com',
  'Opel': 'opel.de',
  'Skoda': 'skoda-auto.com',
  'Porsche': 'porsche.com',
  'Volvo': 'volvo.com',
  'Scania': 'scania.com',
  'DAF': 'daf.com',
  'Renault': 'renault.fr',
  'Schmitz Cargobull': 'cargobull.com',
  'Krone': 'krone-trailer.com',
  'Kögel': 'koegel.com',
  'Schwarzmüller': 'schwarzmueller.com',
  'Kässbohrer': 'kaessbohrer.com',
  'Fliegl': 'fliegl.com',
  'Wielton': 'wielton.com.pl',
  'Humbaur': 'humbaur.com'
};

const customLogos: Record<string, string> = {
  'MAN': '/react-wizard/public/man_logo.png',
  'Iveco': '/react-wizard/public/iveco_logo.png'
};

export const StepBrand: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const { t } = useTranslation();

  let currentBrands = truckBrands;
  if (data.vehicleType === 'pkw') {
    currentBrands = carBrands;
  } else if (data.vehicleType === 'auflieger' || data.vehicleType === 'anhaenger') {
    currentBrands = trailerBrands;
  }

  const [customBrand, setCustomBrand] = useState(data.brand && !currentBrands.includes(data.brand) ? data.brand : '');

  const handleSelect = (brand: string) => {
    if (brand === 'Andere') {
      updateData({ brand: 'Andere' });
      scrollToElement('customBrand-form');
    } else {
      updateData({ brand });
      setTimeout(() => nextStep(), 300);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBrand.trim()) {
      updateData({ brand: customBrand });
      nextStep();
    }
  };

  return (
    <StepLayout title={t('step_brand_title')}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentBrands.map((brand) => (
          <CardButton
            key={brand}
            label={brand === 'Andere' ? t('brand_other') : brand}
            icon={brand !== 'Andere' && (customLogos[brand] || brandDomains[brand]) ? (
              <img
                src={customLogos[brand] || `https://logo.clearbit.com/${brandDomains[brand]}`}
                alt={`${brand} Logo`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  if (!customLogos[brand]) {
                    e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${brandDomains[brand]}&sz=128`;
                  }
                }}
              />
            ) : null}
            selected={data.brand === brand || (brand === 'Andere' && data.brand === 'Andere')}
            onClick={() => handleSelect(brand)}
            className={`py-4 px-2 text-base ${brand === 'Andere' ? 'col-span-2 md:col-span-1 mx-auto w-[calc(50%-0.5rem)] md:w-full' : ''}`}
          />
        ))}
      </div>

      {data.brand === 'Andere' && (
        <form id="customBrand-form" onSubmit={handleCustomSubmit} className="mt-10 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 w-full px-2">
          <label htmlFor="customBrand" className="block text-sm font-semibold text-neutral-900 mb-3">
            {t('brand_custom_label')} <span className="text-neutral-400 font-normal">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="customBrand"
              type="text"
              required
              value={customBrand}
              onChange={(e) => setCustomBrand(e.target.value)}
              className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-black focus:border-black"
              placeholder={t('brand_custom_placeholder')}
            />
            <button
              type="submit"
              disabled={!customBrand.trim()}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black px-8 py-4 font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none hover:bg-neutral-900"
            >
              <span>{t('wizard_next')}</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 group-disabled:opacity-50">arrow_forward</span>
            </button>
          </div>
        </form>
      )}
    </StepLayout>
  );
};
