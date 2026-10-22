import { cn } from '../../lib/utils';

export const DataTable = ({ children }) => (
  <div className="overflow-x-auto rounded-lg border border-line bg-surface">
    <table className="w-full border-collapse">{children}</table>
  </div>
);

export const Th = ({ className, ...props }) => (
  <th
    className={cn('border-b border-line px-3.5 py-3 text-left align-middle text-xs font-semibold uppercase tracking-[0.05em] text-muted', className)}
    {...props}
  />
);

export const Td = ({ className, ...props }) => (
  <td className={cn('border-b border-line px-3.5 py-3 text-left align-middle text-foreground [tr:last-child_&]:border-b-0', className)} {...props} />
);
