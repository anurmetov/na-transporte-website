import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../hooks/useTranslation';
import { StepLayout } from '../ui/StepLayout';

export const StepSummary: React.FC = () => {
  const { data, nextStep } = useFormStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const isTrailer = data.vehicleType === 'auflieger' || data.vehicleType === 'anhaenger';
  const hideTuevAndAccident = isTrailer || data.vehicleType === 'szm' || data.vehicleType === 'lkw';

  const handleSubmit = async () => {
    setLoading(true);
    
    // Construct the payload based on user requirements
    const payload = {
      vehicle_type: data.vehicleType === 'andere' ? data.otherType : (data.lkwWeight ? `${data.vehicleType} (${data.lkwWeight})` : (isTrailer && data.trailerType ? `${data.vehicleType} (${data.trailerType})` : data.vehicleType)),
      manufacturer: data.brand || '-',
      model: data.model || '-',
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
      alert(t('err_submit'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StepLayout title={t('step_summary')} subtitle={t('step_summary_subtitle')}>
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8 max-w-2xl mx-auto text-left">
        
        <h3 className="font-semibold text-lg mb-4 border-b border-neutral-100 pb-2">{t('summary_vehicle')}</h3>
        <ul className="space-y-3 mb-6">
          <li className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-neutral-50 pb-2 sm:border-0 sm:pb-0">
            <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_type')}</span> 
            <span className="font-medium text-neutral-900 break-words">{data.vehicleType === 'andere' ? data.otherType : (data.lkwWeight ? `${data.vehicleType} (${data.lkwWeight})` : (isTrailer && data.trailerType ? `${data.vehicleType} (${data.trailerType})` : data.vehicleType))}</span>
          </li>
          {data.vehicleType !== 'andere' && (
            <>
              <li className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-neutral-50 pb-2 sm:border-0 sm:pb-0">
                <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_brand_label')}</span>
                <span className="font-medium text-neutral-900 break-words">{data.brand}</span>
              </li>
              {['pkw', 'lkw', 'szm', 'auflieger'].includes(data.vehicleType) && data.model && (
                <li className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-neutral-50 pb-2 sm:border-0 sm:pb-0">
                  <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_model')}</span>
                  <span className="font-medium text-neutral-900 break-words">{data.model.replace('(Alle)', `(${t('model_all')})`)}</span>
                </li>
              )}
              <li className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-neutral-50 pb-2 sm:border-0 sm:pb-0">
                <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_year_label')}</span>
                <span className="font-medium text-neutral-900 break-words">{data.year}</span>
              </li>
              {!isTrailer && (
                <>
                  <li className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-neutral-50 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_mileage_label')}</span>
                    <span className="font-medium text-neutral-900 break-words">{data.mileage}</span>
                  </li>
                  {!hideTuevAndAccident && (
                    <>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-neutral-50 pb-2 sm:border-0 sm:pb-0">
                        <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_tuev')}</span> 
                        <span className="font-medium text-neutral-900 break-words">{data.tuevAvailable === 'Ja' ? `${t('data_yes')} (${data.tuevMonth}/${data.tuevYear})` : t('data_no')}</span>
                      </li>
                      <li className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <span className="text-neutral-500 sm:w-1/3 shrink-0 break-words">{t('summary_accident')}</span>
                        <span className="font-medium text-neutral-900 break-words">{data.unfallfrei === 'Ja' ? t('data_yes') : (data.unfallfrei === 'Nein' ? t('data_no') : data.unfallfrei)}</span>
                      </li>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </ul>

        {data.photos && data.photos.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mb-4 border-b border-neutral-100 pb-2">{t('summary_photos_label')} ({data.photos.length})</h3>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {data.photos.map((p, i) => (
                <img key={i} src={URL.createObjectURL(p)} className="w-16 h-16 object-cover rounded-lg border border-neutral-200" alt={`Upload ${i}`} />
              ))}
            </div>
          </>
        )}

        <h3 className="font-semibold text-lg mb-4 border-b border-neutral-100 pb-2">{t('summary_contact_label')}</h3>
        <ul className="space-y-2 mb-8">
          <li><span className="text-neutral-500 w-32 inline-block">{t('summary_name')}</span> {data.name}</li>
          <li><span className="text-neutral-500 w-32 inline-block">{t('summary_phone')}</span> {data.phone}</li>
          <li><span className="text-neutral-500 w-32 inline-block">{t('summary_email')}</span> {data.email}</li>
        </ul>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white px-8 py-4 rounded-xl font-medium text-lg disabled:opacity-50 hover:bg-neutral-800 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            t('wizard_submit_final')
          )}
        </button>

      </div>
    </StepLayout>
  );
};
