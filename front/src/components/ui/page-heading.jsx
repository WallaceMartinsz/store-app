import { cn } from '../../lib/utils';

export const PageHeading = ({ title, description, actions, className }) => (
  <div
    className={cn(
      'mb-6',
      actions && 'flex items-center justify-between gap-4 max-[760px]:flex-col max-[760px]:items-start',
      className
    )}
  >
    <div>
      <h1 className="mb-2 text-[28px] font-bold text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
    {actions}
  </div>
);

export const SectionHeader = ({ title, count, className }) => (
  <div className={cn('flex items-baseline gap-3', className)}>
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    {count && <span className="text-[13px] text-subtle">{count}</span>}
  </div>
);
