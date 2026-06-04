import { create } from 'zustand';

export interface FormState {
  vehicleType: string;
  lkwWeight: string; // "über 7.5T" or "unter 7.5T"
  otherType: string;
  brand: string;
  year: string;
  mileage: string;
  unfallfrei: string;
  tuevAvailable: string;
  tuevMonth: string;
  tuevYear: string; // "Ja" or "Nein"
  condition: {
    motor: string;
    getriebe: string;
    achsen: string;
    maengel: string;
  };
  photos: File[];
  name: string;
  phone: string;
  email: string;
}

interface WizardStore {
  step: number;
  data: FormState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (partial: Partial<FormState>) => void;
  updateCondition: (partial: Partial<FormState["condition"]>) => void;
  reset: () => void;
}

const initialState: FormState = {
  vehicleType: '',
  lkwWeight: '',
  otherType: '',
  brand: '',
  year: '',
  mileage: '',
  unfallfrei: '',
  tuevAvailable: '',
  tuevMonth: '',
  tuevYear: '',
  condition: {
    motor: '',
    getriebe: '',
    achsen: '',
    maengel: '',
  },
  photos: [],
  name: '',
  phone: '',
  email: '',
};

export const useFormStore = create<WizardStore>((set) => ({
  step: 1,
  data: initialState,
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step > 1 ? state.step - 1 : 1 })),
  updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
  updateCondition: (partial) => set((state) => ({ 
    data: { 
      ...state.data, 
      condition: { ...state.data.condition, ...partial } 
    } 
  })),
  reset: () => set({ step: 1, data: initialState }),
}));
