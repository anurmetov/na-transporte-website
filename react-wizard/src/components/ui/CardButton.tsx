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
        "flex flex-col items-center justify-center gap-4 p-6 rounded-2xl transition-all duration-300 w-full outline-none",
        selected 
          ? "border border-neutral-900 bg-neutral-50 text-neutral-900 shadow-sm ring-1 ring-neutral-900" 
          : "border border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-900 hover:bg-neutral-50 hover:shadow-sm",
        className
      )}
      {...props}
    >
      {icon && <div className={cn("text-4xl transition-colors", selected ? "text-neutral-900" : "text-neutral-400")}>{icon}</div>}
      <span className="font-medium text-lg text-center tracking-tight">{label}</span>
    </button>
  );
};
