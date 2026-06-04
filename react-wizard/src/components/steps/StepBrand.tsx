import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';

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
  'MAN': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/MAN_logo.svg/512px-MAN_logo.svg.png',
  'Iveco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Iveco_Logo.svg/512px-Iveco_Logo.svg.png'
};

export const StepBrand: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  
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
    <StepLayout title="Welche Marke hat das Fahrzeug?">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentBrands.map((brand) => (
          <CardButton
            key={brand}
            label={brand}
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
        <form onSubmit={handleCustomSubmit} className="mt-8 max-w-md mx-auto animate-in fade-in slide-in-from-top-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bitte Marke eingeben:</label>
          <div className="flex gap-4">
            <input
              type="text"
              required
              value={customBrand}
              onChange={(e) => setCustomBrand(e.target.value)}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3"
              placeholder="Fahrzeugmarke..."
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              Weiter
            </button>
          </div>
        </form>
      )}
    </StepLayout>
  );
};
