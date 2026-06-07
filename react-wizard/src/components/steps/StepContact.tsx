import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { StepLayout } from '../ui/StepLayout';

export const StepContact: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });

  const isComplete = data.name.trim() && data.phone.trim() && data.email.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (isComplete) nextStep();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');
    let formatted = digits;
    
    if (digits.length > 4) {
      formatted = `${digits.slice(0,4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
    }
    
    updateData({ phone: formatted.trim() });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <StepLayout 
      title="Ihre Kontaktdaten"
      subtitle="Damit wir Ihnen ein Angebot senden können."
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto text-left w-full px-2" noValidate>
        <div className="space-y-2.5">
          <label htmlFor="name" className="block text-sm font-semibold text-neutral-900">
            Name / Firma <span className="text-neutral-400 font-normal">*</span>
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              required
              className={`w-full rounded-2xl border bg-neutral-50 px-5 py-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-black ${
                touched.name && !data.name.trim() ? 'border-red-500 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              onBlur={() => handleBlur('name')}
              placeholder="Max Mustermann"
              aria-invalid={touched.name && !data.name.trim() ? "true" : "false"}
            />
            {touched.name && !data.name.trim() && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 material-symbols-outlined text-[20px]">error</span>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900">
            Telefonnummer <span className="text-neutral-400 font-normal">*</span>
          </label>
          <div className="relative">
            <input
              id="phone"
              type="tel"
              required
              className={`w-full rounded-2xl border bg-neutral-50 px-5 py-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-black ${
                touched.phone && !data.phone.trim() ? 'border-red-500 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
              value={data.phone}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phone')}
              placeholder="0170 1234567"
              aria-invalid={touched.phone && !data.phone.trim() ? "true" : "false"}
            />
            {touched.phone && !data.phone.trim() && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 material-symbols-outlined text-[20px]">error</span>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <label htmlFor="email" className="block text-sm font-semibold text-neutral-900">
            E-Mail Adresse <span className="text-neutral-400 font-normal">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              className={`w-full rounded-2xl border bg-neutral-50 px-5 py-4 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-black focus:border-black ${
                touched.email && !data.email.trim() ? 'border-red-500 bg-red-50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              onBlur={() => handleBlur('email')}
              placeholder="mail@beispiel.de"
              aria-invalid={touched.email && !data.email.trim() ? "true" : "false"}
            />
            {touched.email && !data.email.trim() && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 material-symbols-outlined text-[20px]">error</span>
            )}
          </div>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={!isComplete}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-black px-8 py-4 text-lg font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none hover:bg-neutral-900"
          >
            <span>Zusammenfassung anzeigen</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 group-disabled:translate-x-0 group-disabled:opacity-50">arrow_forward</span>
          </button>
        </div>
      </form>
    </StepLayout>
  );
};
