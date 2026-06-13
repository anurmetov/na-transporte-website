import { useState, useEffect } from 'react';
import { wizardDict, type TranslationKey, type Language } from '../i18n/dict';

export function useTranslation() {
    const [lang, setLang] = useState<Language>('de');

    useEffect(() => {
        // Init with global language if set, otherwise fallback to localStorage, otherwise 'de'
        const globalLang = document.documentElement.lang as Language;
        const storedLang = localStorage.getItem('preferredLanguage') as Language;
        const initialLang = (globalLang === 'de' || globalLang === 'en' || globalLang === 'fr' || globalLang === 'ru') 
            ? globalLang 
            : (storedLang || 'de');
            
        setLang(initialLang);

        const handleLanguageChanged = (e: CustomEvent<{ lang: Language }>) => {
            if (e.detail && e.detail.lang) {
                setLang(e.detail.lang);
            }
        };

        // Listen for the custom event emitted by i18n.js
        window.addEventListener('languageChanged', handleLanguageChanged as EventListener);

        return () => {
            window.removeEventListener('languageChanged', handleLanguageChanged as EventListener);
        };
    }, []);

    const t = (key: TranslationKey): string => {
        const entry = wizardDict[key];
        if (!entry) return key; // fallback to key itself if missing
        return entry[lang] || entry['de'] || key;
    };

    return { t, lang };
}
