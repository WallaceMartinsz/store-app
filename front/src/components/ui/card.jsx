import { cn } from '../../lib/utils';

export const cardClasses = 'rounded-[10px] border border-line bg-surface';

export const Card = ({ as: Component = 'div', className, ...props }) => (
  <Component className={cn(cardClasses, className)} {...props} />
);
