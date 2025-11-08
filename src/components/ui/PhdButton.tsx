'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const phdButtonVariants = cva(
  'group relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none transform active:scale-95 hover:-translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-brand-gold-hover hover:shadow-button-hover',
        outline: 'border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);


export interface PhdButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof phdButtonVariants> {
  asChild?: boolean;
}

const PhdButton = React.forwardRef<HTMLButtonElement, PhdButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(phdButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
PhdButton.displayName = 'PhdButton';

export { PhdButton, phdButtonVariants };
