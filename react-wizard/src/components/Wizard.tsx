import { useFormStore } from '../store/useFormStore';
import { StepOtherType } from './steps/StepOtherType';
import { StepVehicleType } from './steps/StepVehicleType';
import { StepLkwWeight } from './steps/StepLkwWeight';
import { StepBrand } from './steps/StepBrand';
import { StepData } from './steps/StepData';
import { StepCondition } from './steps/StepCondition';
import { StepPhotos } from './steps/StepPhotos';
import { StepContact } from './steps/StepContact';
import { StepSummary } from './steps/StepSummary';
import { StepSuccess } from './steps/StepSuccess';
import { ArrowLeft } from 'lucide-react';

export const Wizard: React.FC = () => {
  const { step, prevStep, data } = useFormStore();

  const renderStep = () => {
    if (step === 1) return <StepVehicleType />;

    if (data.vehicleType === 'andere') {
      switch (step) {
        case 2: return <StepOtherType />;
        case 3: return <StepContact />;
        case 4: return <StepSummary />;
        case 5: return <StepSuccess />;
        default: return null;
      }
    }

    if (data.vehicleType === 'lkw') {
      switch (step) {
        case 2: return <StepLkwWeight />;
        case 3: return <StepBrand />;
        case 4: return <StepData />;
        case 5: return <StepCondition />;
        case 6: return <StepPhotos />;
        case 7: return <StepContact />;
        case 8: return <StepSummary />;
        case 9: return <StepSuccess />;
        default: return null;
      }
    }

    // PKW, Auflieger, Anhänger, SZM
    switch (step) {
      case 2: return <StepBrand />;
      case 3: return <StepData />;
      case 4: return <StepCondition />;
      case 5: return <StepPhotos />;
      case 6: return <StepContact />;
      case 7: return <StepSummary />;
      case 8: return <StepSuccess />;
      default: return null;
    }
  };

  // Logic to determine total steps and progress
  const isLkw = data.vehicleType === 'lkw';
  const isAndere = data.vehicleType === 'andere';
  const totalProgressSteps = isAndere ? 3 : (isLkw ? 7 : 6);
  const currentProgressStep = Math.max(0, Math.min(step - 1, totalProgressSteps));
  const progressPercentage = (currentProgressStep / totalProgressSteps) * 100;
  
  const maxStep = isAndere ? 5 : (isLkw ? 9 : 8);
  const showBack = step > 1 && step < maxStep;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-8 px-4 font-body-md relative overflow-hidden">
      
      {/* Progress Bar & Back Button */}
      {step < maxStep && (
        <div className="w-full max-w-4xl mx-auto mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {showBack ? (
              <button onClick={prevStep} className="flex items-center text-gray-500 hover:text-primary transition-colors font-medium">
                <ArrowLeft className="w-5 h-5 mr-1" /> Zurück
              </button>
            ) : <div className="w-20" />}
            
            <div className="flex-1">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-sm font-bold text-gray-500 w-12 text-right">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full relative">
        {renderStep()}
      </div>

    </div>
  );
};
