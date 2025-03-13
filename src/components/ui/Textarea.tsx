// components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium texto-escuro">{label}</label>}
      <textarea
        ref={ref}
        className={`card-juridico p-3 w-full focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  )
);