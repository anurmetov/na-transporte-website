import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../hooks/useTranslation';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { Car, Truck, TruckIcon, Combine, Settings } from 'lucide-react';

export const StepVehicleType: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const { t } = useTranslation();

  const vehicleTypes = [
    { id: 'pkw', label: t('type_pkw'), icon: <Car /> },
    { id: 'lkw', label: t('type_lkw'), icon: <Truck /> },
    { id: 'szm', label: 'SZM', icon: <TruckIcon /> },
    { id: 'auflieger', label: t('type_trailer'), icon: <Combine /> },
    { id: 'anhaenger', label: 'Anhänger', icon: <Combine /> },
    { id: 'andere', label: 'Andere', icon: <Settings /> },
  ];

  const handleSelect = (id: string) => {
    updateData({ vehicleType: id });
    if (id !== 'lkw') {
      updateData({ lkwWeight: '' }); // reset weight if not LKW
    }
    // Small timeout for user to see the selection before moving
    setTimeout(() => nextStep(), 300);
  };

  return (
    <StepLayout 
      title={t('step_vehicle_type')} 
      subtitle={t('step_vehicle_type_subtitle')}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {vehicleTypes.map((v) => (
          <CardButton
            key={v.id}
            label={v.label}
            icon={v.icon}
            selected={data.vehicleType === v.id}
            onClick={() => handleSelect(v.id)}
          />
        ))}
      </div>
    </StepLayout>
  );
};
