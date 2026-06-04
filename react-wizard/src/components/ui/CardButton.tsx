import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
  label: string;
}

export const CardButton: React.FC<CardButtonProps> = ({ selected, icon, label, className, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 rounded-xl border-2 transition-all duration-200 w-full bg-white",
        selected 
          ? "border-primary bg-primary/5 text-primary shadow-sm scale-[1.02]" 
          : "border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-md",
        className
      )}
      {...props}
    >
      {icon && <div className={cn("text-4xl", selected ? "text-primary" : "text-gray-400")}>{icon}</div>}
      <span className="font-semibold text-lg text-center">{label}</span>
    </button>
  );
};
