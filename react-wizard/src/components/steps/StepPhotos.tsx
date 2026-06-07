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
      <div className="max-w-3xl mx-auto space-y-10 px-2">
        
        <div 
          className={`group relative overflow-hidden border-2 border-dashed rounded-3xl p-10 md:p-14 text-center transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer ${
            dragActive ? 'border-black bg-neutral-50 scale-[0.99]' : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 bg-white'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          aria-label="Fotos hochladen per Klick oder Drag and Drop"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFiles(e.target.files)} 
            className="hidden" 
            multiple 
            accept="image/*" 
            tabIndex={-1}
          />
          <div className="flex justify-center mb-5 text-neutral-900 transition-transform duration-300 group-hover:-translate-y-1">
            <div className="bg-neutral-100 p-4 rounded-full group-hover:bg-neutral-200 transition-colors">
              <Camera className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight">Fotos hier ablegen</h3>
          <p className="text-neutral-500 mb-8 leading-relaxed">oder klicken, um Dateien auszuwählen</p>
          <div className="inline-flex items-center gap-2 font-medium bg-white border border-neutral-200 text-neutral-900 px-6 py-3 rounded-full group-hover:border-neutral-300 group-hover:shadow-sm transition-all">
            <Upload className="w-5 h-5 text-neutral-500" />
            Dateien auswählen
          </div>
        </div>

        {data.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.photos.map((photo, i) => (
              <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center shadow-sm">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Upload ${i+1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                  aria-label="Foto entfernen"
                  className="absolute top-2 right-2 bg-white text-neutral-900 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 hover:bg-neutral-100 hover:text-red-500 transition-all outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.photos.length < 5 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer transition-all outline-none focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                aria-label="Weiteres Foto hinzufügen"
              >
                <ImageIcon className="w-8 h-8 mb-3" />
                <span className="text-sm font-semibold">Hinzufügen</span>
              </button>
            )}
          </div>
        )}

        <div className="pt-8 border-t border-neutral-100 flex justify-end">
          <button
            onClick={nextStep}
            className="group relative flex w-full md:w-auto items-center justify-center gap-3 overflow-hidden rounded-2xl bg-black px-8 py-4 font-semibold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <span>{data.photos.length > 0 ? "Weiter" : "Überspringen & Weiter"}</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>

      </div>
    </StepLayout>
  );
};
