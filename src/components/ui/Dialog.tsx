// components/ui/Dialog.tsx
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'; // Adicione esta importação

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
  }


  export const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog.Root>
  );

export const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
    <RadixDialog.Content
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl focus:outline-none ${className}`}
    >
      {children}
      <RadixDialog.Close className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <X className="w-5 h-5" />
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Portal>
);
interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
  }

  export const DialogHeader = ({ children, className }: DialogHeaderProps) => (
    <div className={`mb-4 ${className || ''}`}>
      {children}
    </div>
  );

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <RadixDialog.Title className="text-xl font-semibold texto-escuro">
    {children}
  </RadixDialog.Title>
);

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 flex justify-end gap-3">{children}</div>
);