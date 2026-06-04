import React, { useRef, useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { StepLayout } from '../ui/StepLayout';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

export const StepPhotos: React.FC = () => {
  const { data, updateData, nextStep } = useFormStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    // Limit to 5 photos max
    const combined = [...data.photos, ...newFiles].slice(0, 5);
    updateData({ photos: combined });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...data.photos];
    newPhotos.splice(index, 1);
    updateData({ photos: newPhotos });
  };

  return (
    <StepLayout title="Fotos hinzufügen (Optional)" subtitle="Laden Sie bis zu 5 Fotos Ihres Fahrzeugs hoch, um eine genauere Bewertung zu erhalten.">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50 bg-white'}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFiles(e.target.files)} 
            className="hidden" 
            multiple 
            accept="image/*" 
          />
          <div className="flex justify-center mb-4 text-gray-400">
            <Camera className="w-16 h-16" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fotos hier ablegen</h3>
          <p className="text-gray-500 mb-6">oder auf den Button klicken, um Dateien auszuwählen</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 mx-auto"
          >
            <Upload className="w-5 h-5" />
            Dateien auswählen
          </button>
        </div>

        {data.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.photos.map((photo, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Upload ${i+1}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => removePhoto(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.photos.length < 5 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">Hinzufügen</span>
              </div>
            )}
          </div>
        )}

        <div className="pt-6 border-t flex justify-end">
          <button
            onClick={nextStep}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          >
            {data.photos.length > 0 ? "Weiter" : "Überspringen & Weiter"}
          </button>
        </div>

      </div>
    </StepLayout>
  );
};
