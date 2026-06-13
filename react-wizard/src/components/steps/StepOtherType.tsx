import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../hooks/useTranslation';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';

export const StepOtherType: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const { t } = useTranslation();

  const otherOptions = [
    { id: 'Unimog', label: t('type_unimog') },
    { id: 'Baumaschinen', label: t('type_baumaschine') },
    { id: 'Stapler', label: t('type_stapler') },
    { id: 'Kommunalfahrzeuge', label: t('type_kommunal') },
    { id: 'Zubehör', label: t('type_zubehoer') }
  ];

  const handleSelect = (type: string) => {
    updateData({ otherType: type });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <StepLayout title={t('step_vehicle_type_subtitle')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {otherOptions.map((opt) => (
          <CardButton
            key={opt.id}
            label={opt.label}
            selected={data.otherType === opt.id}
            onClick={() => handleSelect(opt.id)}
            className="py-6 px-4"
          />
        ))}
      </div>
    </StepLayout>
  );
};
