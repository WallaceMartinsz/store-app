import { cn } from '../../lib/utils';

// Duas opcoes com um indicador que desliza ate a opcao ativa (so CSS)
const SegmentedControl = ({ options, value, onChange, className }) => {
  const activeIndex = Math.max(options.findIndex((option) => option.value === value), 0);

  return (
    <div className={cn('relative grid grid-cols-2 gap-1 rounded-lg border border-line bg-background p-1', className)}>
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 w-[calc(50%-6px)] rounded-md bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out"
        style={{ transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))` }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'relative min-h-[38px] cursor-pointer rounded-md transition-colors',
            option.value === value ? 'font-semibold text-foreground' : 'text-muted'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
