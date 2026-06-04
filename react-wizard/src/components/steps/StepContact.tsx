import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { StepLayout } from '../ui/StepLayout';

export const StepContact: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();

  const isComplete = data.name.trim() && data.phone.trim() && data.email.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) nextStep();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');
    let formatted = digits;
    
    // Simple formatting for readability (e.g. 0170 1234567)
    if (digits.length > 4) {
      formatted = `${digits.slice(0,4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
    }
    
    updateData({ phone: formatted.trim() });
  };

  return (
    <StepLayout 
      title="Ihre Kontaktdaten"
      subtitle="Damit wir Ihnen ein Angebot senden können."
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto text-left">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Name / Firma *</label>
          <input
            type="text"
            required
            className="w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 p-4 bg-white"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Max Mustermann"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Telefonnummer *</label>
          <input
            type="tel"
            required
            className="w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 p-4 bg-white"
            value={data.phone}
            onChange={handlePhoneChange}
            placeholder="0170 1234567"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">E-Mail Adresse *</label>
          <input
            type="email"
            required
            className="w-full rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 p-4 bg-white"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="mail@beispiel.de"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isComplete}
            className="w-full bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
          >
            Zusammenfassung anzeigen
          </button>
        </div>
      </form>
    </StepLayout>
  );
};
