import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';
import { ArrowDown, ArrowUp } from 'lucide-react';

const weightOptions = [
  { id: 'unter_7.5t', label: 'Unter 7.5T', icon: <ArrowDown /> },
  { id: 'ueber_7.5t', label: 'Über 7.5T', icon: <ArrowUp /> },
];

export const StepLkwWeight: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();

  const handleSelect = (id: string) => {
    updateData({ lkwWeight: id });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <StepLayout 
      title="Gewichtsklasse des LKW" 
      subtitle="Ist der LKW über oder unter 7.5 Tonnen?"
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
