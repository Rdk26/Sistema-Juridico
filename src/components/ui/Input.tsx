// components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium texto-escuro">{label}</label>}
      <input
        ref={ref}
        className={`card-juridico p-3 w-full focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? 'border-red-500 ring-red-200' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';