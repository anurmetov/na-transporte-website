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
          <label className="block text-xl font-bold text-gray-900 mb-4">Motor / Antrieb</label>
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
          <label className="block text-xl font-bold text-gray-900 mb-4">Getriebe</label>
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
          <label className="block text-xl font-bold text-gray-900 mb-4">Achsen</label>
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
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4">Weitere bekannte Mängel/Schäden</label>
          <textarea
            rows={3}
            className="w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 p-4 text-lg bg-white"
            placeholder="Beschreiben Sie hier eventuelle weitere Schäden (optional)"
            value={c.maengel}
            onChange={(e) => updateCondition({ maengel: e.target.value })}
          />
        </div>

        {/* Action */}
        <div className="pt-6 border-t flex justify-end">
          <button
            disabled={!isComplete}
            onClick={nextStep}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
          >
            Weiter
          </button>
        </div>

      </div>
    </StepLayout>
  );
};
