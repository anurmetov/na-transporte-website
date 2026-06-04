import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const StepLayout: React.FC<StepLayoutProps> = ({ title, subtitle, children }) => {
  useEffect(() => {
    // Scroll to the top of the wizard container when a new step renders
    const wizardEl = document.getElementById('react-wizard-root');
    if (wizardEl) {
      // Small timeout to allow DOM to settle after framer-motion swap
      setTimeout(() => {
        const y = wizardEl.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto py-8"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{title}</h2>
        {subtitle && <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
};
