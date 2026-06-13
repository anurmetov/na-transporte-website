import React from 'react';
import { StepLayout } from '../ui/StepLayout';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const StepSuccess: React.FC = () => {
  const { t } = useTranslation();
  return (
    <StepLayout title={t('success_title_screen')}>
      <div className="flex flex-col items-center justify-center p-8">
        <CheckCircle className="text-neutral-900 w-24 h-24 mb-6" />
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">{t('success_subtitle')}</h2>
        <p className="text-lg text-neutral-600 text-center max-w-md">
          {t('success_message')}
        </p>
      </div>
    </StepLayout>
  );
};
