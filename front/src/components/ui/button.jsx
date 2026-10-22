import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const pressable = 'border transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] disabled:active:scale-100';

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium no-underline disabled:cursor-not-allowed disabled:opacity-[0.45]',
  {
    variants: {
      variant: {
        default: cn(pressable, 'border-primary bg-primary text-white hover:border-primary-hover hover:bg-primary-hover'),
        secondary: cn(pressable, 'border-line bg-transparent text-foreground hover:bg-line'),
        danger: cn(pressable, 'border-danger bg-danger text-white hover:border-danger-hover hover:bg-danger-hover'),
        success: cn(pressable, 'animate-added-flash border-success-strong bg-success-strong text-white hover:border-success-hover hover:bg-success-hover'),
        link: 'bg-transparent text-muted transition-colors hover:text-foreground'
      },
      size: {
        default: 'min-h-[40px] px-4 text-sm',
        sm: 'min-h-[32px] px-2.5 text-[13px]',
        lg: 'min-h-[48px] px-6 text-[15px]',
        none: 'text-sm'
      },
      full: {
        true: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

// `as` permite renderizar como Link ou <a> mantendo o visual do botao
const Button = forwardRef(({ as: Component = 'button', className, variant, size, full, ...props }, ref) => (
  <Component ref={ref} className={cn(buttonVariants({ variant, size, full }), className)} {...props} />
));

Button.displayName = 'Button';

export default Button;
