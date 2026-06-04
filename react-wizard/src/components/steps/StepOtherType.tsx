import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { CardButton } from '../ui/CardButton';
import { StepLayout } from '../ui/StepLayout';

const otherOptions = ['Unimog', 'Baumaschinen', 'Stapler', 'Kommunalfahrzeuge', 'Zubehör'];

export const StepOtherType: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();

  const handleSelect = (type: string) => {
    updateData({ otherType: type });
    setTimeout(() => nextStep(), 300);
  };

  return (
    <StepLayout title="Was möchten Sie verkaufen?">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {otherOptions.map((opt) => (
          <CardButton
            key={opt}
            label={opt}
            selected={data.otherType === opt}
            onClick={() => handleSelect(opt)}
            className="py-6 px-4"
          />
        ))}
      </div>
    </StepLayout>
  );
};
