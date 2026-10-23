import { cn } from '../../lib/utils';

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      'cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-200 hover:border-primary active:scale-95',
      active ? 'border-primary bg-primary text-white' : 'border-line bg-transparent text-muted hover:text-foreground'
    )}
  >
    {children}
  </button>
);

export default Chip;
