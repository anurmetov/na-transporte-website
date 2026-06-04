import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { StepLayout } from '../ui/StepLayout';

export const StepSummary: React.FC = () => {
  const { data, nextStep } = useFormStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    
    // Construct the payload based on user requirements
    const payload = {
      vehicle_type: data.vehicleType === 'andere' ? data.otherType : (data.lkwWeight ? `${data.vehicleType} (${data.lkwWeight})` : data.vehicleType),
      manufacturer: data.brand || '-',
      model: '-',
      year: data.year || '-',
      mileage: data.mileage || '-',
      accident_full: data.unfallfrei || '-',
      state_drive_full: data.condition.motor || '-',
      state_gear_full: data.condition.getriebe || '-',
      state_axle_full: data.condition.achsen || '-',
      other_defects: data.condition.maengel || '',
      tuev_available: data.tuevAvailable.toLowerCase() === 'ja' ? 'ja' : 'nein',
      tuev: data.tuevAvailable === 'Ja' ? `${data.tuevMonth}/${data.tuevYear}` : '-',
      name: data.name,
      phone: data.phone,
      email: data.email
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (data.photos && data.photos.length > 0) {
      data.photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }

    try {
      const response = await fetch('/api/lead', { 
        method: 'POST', 
        body: formData
      });
      
      if (!response.ok) throw new Error('API Error');
      
      nextStep(); // Go to success screen
    } catch (e) {
      alert("Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepLayout title="Zusammenfassung" subtitle="Bitte prüfen Sie Ihre Angaben.">
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 max-w-2xl mx-auto text-left">
        
        <h3 className="font-bold text-lg mb-4 border-b pb-2">Fahrzeug</h3>
        <ul className="space-y-2 mb-6">
          <li>
            <span className="text-gray-500 w-32 inline-block">Typ:</span> 
            {data.vehicleType === 'andere' ? data.otherType : (data.lkwWeight ? `${data.vehicleType} (${data.lkwWeight})` : data.vehicleType)}
          </li>
          {data.vehicleType !== 'andere' && (
            <>
              <li><span className="text-gray-500 w-32 inline-block">Marke:</span> {data.brand}</li>
              <li><span className="text-gray-500 w-32 inline-block">Baujahr:</span> {data.year}</li>
              <li><span className="text-gray-500 w-32 inline-block">Kilometer:</span> {data.mileage}</li>
              <li>
                <span className="text-gray-500 w-32 inline-block">TÜV/HU:</span> 
                {data.tuevAvailable === 'Ja' ? `Ja (${data.tuevMonth}/${data.tuevYear})` : 'Nein'}
              </li>
            </>
          )}
        </ul>

        {data.vehicleType !== 'andere' && (
          <>
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Zustand</h3>
            <ul className="space-y-2 mb-6">
              <li><span className="text-gray-500 w-32 inline-block">Unfallfrei:</span> {data.unfallfrei}</li>
              <li><span className="text-gray-500 w-32 inline-block">Motor:</span> {data.condition.motor}</li>
              <li><span className="text-gray-500 w-32 inline-block">Getriebe:</span> {data.condition.getriebe}</li>
              <li><span className="text-gray-500 w-32 inline-block">Achsen:</span> {data.condition.achsen}</li>
              {data.condition.maengel && (
                <li><span className="text-gray-500 w-32 inline-block">Mängel:</span> {data.condition.maengel}</li>
              )}
            </ul>
          </>
        )}

        {data.photos && data.photos.length > 0 && (
          <>
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Fotos ({data.photos.length})</h3>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {data.photos.map((p, i) => (
                <img key={i} src={URL.createObjectURL(p)} className="w-16 h-16 object-cover rounded-lg border" alt={`Upload ${i}`} />
              ))}
            </div>
          </>
        )}

        <h3 className="font-bold text-lg mb-4 border-b pb-2">Kontakt</h3>
        <ul className="space-y-2 mb-8">
          <li><span className="text-gray-500 w-32 inline-block">Name:</span> {data.name}</li>
          <li><span className="text-gray-500 w-32 inline-block">Telefon:</span> {data.phone}</li>
          <li><span className="text-gray-500 w-32 inline-block">E-Mail:</span> {data.email}</li>
        </ul>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-green-700 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            "Jetzt kostenfrei bewerten lassen"
          )}
        </button>

      </div>
    </StepLayout>
  );
};
