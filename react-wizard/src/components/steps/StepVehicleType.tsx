import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { Car, Truck, TruckIcon, Combine, Settings } from 'lucide-react';

const vehicleTypes = [
  { id: 'pkw', label: 'PKW', icon: <Car /> },
  { id: 'lkw', label: 'LKW', icon: <Truck /> },
  { id: 'szm', label: 'SZM', icon: <TruckIcon /> },
  { id: 'auflieger', label: 'Auflieger', icon: <Combine /> },
  { id: 'anhaenger', label: 'Anhänger', icon: <Combine /> },
  { id: 'andere', label: 'Andere', icon: <Settings /> },
];

export const StepVehicleType: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();

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
      title="Welches Fahrzeug möchten Sie verkaufen?" 
      subtitle="Bitte wählen Sie den entsprechenden Fahrzeugtyp aus."
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
