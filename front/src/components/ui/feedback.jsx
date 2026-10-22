import { cn } from '../../lib/utils';

const FEEDBACK_VARIANTS = {
  error: 'text-danger-text',
  success: 'rounded-lg border border-success/40 bg-success/[0.08] px-4 py-3 text-success'
};

export const Feedback = ({ variant, className, children }) => (
  <p className={cn('mb-4', FEEDBACK_VARIANTS[variant], className)} role={variant === 'error' ? 'alert' : undefined}>
    {children}
  </p>
);

export const EmptyState = ({ icon: Icon, children, action }) => (
  <div className="flex animate-fade-up flex-col items-center gap-3 rounded-xl border border-dashed border-line px-4 py-12 text-center text-muted">
    {Icon && <Icon size={40} aria-hidden="true" />}
    <p>{children}</p>
    {action}
  </div>
);

export const Spinner = () => (
  <span
    className="h-3.5 w-3.5 animate-spin-fast rounded-full border-2 border-white/35 border-t-white"
    aria-hidden="true"
  />
);
