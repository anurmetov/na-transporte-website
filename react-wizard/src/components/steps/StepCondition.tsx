import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';

const conditionOptions = ['Top', 'OK', 'Mangelhaft', 'Defekt'];

export const StepCondition: React.FC = () => {
  const { data, updateCondition, nextStep } = useFormStore();
  const c = data.condition;

  const isComplete = c.motor && c.getriebe && c.achsen;

  return (
    <StepLayout title="Zustand des Fahrzeugs">
      <div className="space-y-10 max-w-3xl mx-auto text-left">
        
        {/* Motor */}
        <div>
          <label className="block text-xl font-medium text-neutral-900 mb-4">Motor / Antrieb</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {conditionOptions.map(opt => (
              <CardButton
                key={opt}
                label={opt}
                selected={c.motor === opt}
                onClick={() => updateCondition({ motor: opt })}
                className="py-3 px-2 text-sm"
              />
            ))}
          </div>
        </div>

        {/* Getriebe */}
        <div>
          <label className="block text-xl font-medium text-neutral-900 mb-4">Getriebe</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {conditionOptions.map(opt => (
              <CardButton
                key={opt}
                label={opt}
                selected={c.getriebe === opt}
                onClick={() => updateCondition({ getriebe: opt })}
                className="py-3 px-2 text-sm"
              />
            ))}
          </div>
        </div>

        {/* Achsen */}
        <div>
          <label className="block text-xl font-medium text-neutral-900 mb-4">Achsen</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {conditionOptions.map(opt => (
              <CardButton
                key={opt}
                label={opt}
                selected={c.achsen === opt}
                onClick={() => updateCondition({ achsen: opt })}
                className="py-3 px-2 text-sm"
              />
            ))}
          </div>
        </div>

        {/* Mängel */}
        <div className="space-y-3">
          <label htmlFor="maengel" className="block text-xl font-bold text-neutral-900 tracking-tight">Weitere bekannte Mängel/Schäden <span className="text-sm text-neutral-500 font-normal ml-2">(Optional)</span></label>
          <textarea
            id="maengel"
            rows={3}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 hover:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Beschreiben Sie hier eventuelle weitere Schäden..."
            value={c.maengel}
            onChange={(e) => updateCondition({ maengel: e.target.value })}
          />
        </div>

        {/* Action */}
        <div className="pt-8 border-t border-neutral-100 flex justify-end">
          <button
            disabled={!isComplete}
            onClick={nextStep}
            className="group relative flex w-full md:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black px-8 py-4 font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none hover:bg-neutral-900"
          >
            <span>Weiter</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 group-disabled:opacity-50">arrow_forward</span>
          </button>
        </div>

      </div>
    </StepLayout>
  );
};
