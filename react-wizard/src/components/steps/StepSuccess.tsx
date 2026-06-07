import React from 'react';
import { StepLayout } from '../ui/StepLayout';
import { CheckCircle } from 'lucide-react';

export const StepSuccess: React.FC = () => {
  return (
    <StepLayout title="Danke für Ihre Anfrage!">
      <div className="flex flex-col items-center justify-center p-8">
        <CheckCircle className="text-neutral-900 w-24 h-24 mb-6" />
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Erfolgreich gesendet!</h2>
        <p className="text-lg text-neutral-600 text-center max-w-md">
          Ihre Fahrzeugdaten wurden erfolgreich an uns übermittelt. Wir werden uns in Kürze mit einem passenden Angebot bei Ihnen melden.
        </p>
      </div>
    </StepLayout>
  );
};
