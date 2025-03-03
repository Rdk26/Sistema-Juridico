// components/ui/Button.tsx
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Button = ({ children, className, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center ${className}`}
  >
    {children}
  </button>
);