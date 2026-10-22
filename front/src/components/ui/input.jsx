import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const fieldVariants = cva(
  'rounded-md border border-line text-foreground transition-colors focus:border-primary focus:outline-none',
  {
    variants: {
      size: {
        default: 'w-full bg-background px-3 py-2.5',
        sm: 'w-[72px] bg-background p-2',
        toolbar: 'h-[38px] bg-surface px-3 text-sm'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export const Input = forwardRef(({ className, size, ...props }, ref) => (
  <input ref={ref} className={cn(fieldVariants({ size }), className)} {...props} />
));

Input.displayName = 'Input';

export const Select = forwardRef(({ className, size, ...props }, ref) => (
  <select ref={ref} className={cn(fieldVariants({ size }), className)} {...props} />
));

Select.displayName = 'Select';

// A dica so aparece enquanto nao houver erro no campo
export const Field = ({ label, error, hint, children }) => (
  <label className="grid gap-1.5 text-sm font-medium text-muted">
    {label}
    {children}
    {error && <span className="text-[13px] text-danger-text">{error}</span>}
    {!error && hint && <span className="text-xs text-subtle">{hint}</span>}
  </label>
);
