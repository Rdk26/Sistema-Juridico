// components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium texto-escuro">{label}</label>}
      <input
        ref={ref}
        className={`card-juridico p-3 w-full focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  )
);