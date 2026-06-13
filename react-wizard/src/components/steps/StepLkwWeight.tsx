import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../hooks/useTranslation';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { ArrowDown, ArrowUp } from 'lucide-react';

export const StepLkwWeight: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const { t } = useTranslation();

  const weightOptions = [
    { id: 'unter_7.5t', label: t('weight_under'), icon: <ArrowDown /> },
    { id: 'ueber_7.5t', label: t('weight_over'), icon: <ArrowUp /> },
  ];

  const handleSelect = (id: string) => {
    updateData({ lkwWeight: id });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <StepLayout 
      title={t('step_lkw_weight')} 
      subtitle={t('step_lkw_weight_subtitle')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
        {weightOptions.map((v) => (
          <CardButton
            key={v.id}
            label={v.label}
            icon={v.icon}
            selected={data.lkwWeight === v.id}
            onClick={() => handleSelect(v.id)}
          />
        ))}
      </div>
    </StepLayout>
  );
};
