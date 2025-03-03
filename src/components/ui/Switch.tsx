// components/ui/Switch.tsx
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const switchVariants = cva(
  'inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300',
        destructive: 'data-[state=checked]:bg-destructive data-[state=unchecked]:bg-gray-300'
      },
      size: {
        default: 'w-11 h-6',
        sm: 'w-9 h-5'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

const thumbVariants = cva(
  'block rounded-full bg-white shadow-lg ring-0 transition-transform',
  {
    variants: {
      size: {
        default: 'h-5 w-5 translate-x-1 data-[state=checked]:translate-x-6',
        sm: 'h-4 w-4 translate-x-0.5 data-[state=checked]:translate-x-4.5'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  className?: string;
  thumbClassName?: string;
}

const Switch = forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, variant, size, thumbClassName, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={switchVariants({ variant, size, className })}
      {...props}
    >
      <SwitchPrimitive.Thumb className={thumbVariants({ size, className: thumbClassName })} />
    </SwitchPrimitive.Root>
  )
);

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };