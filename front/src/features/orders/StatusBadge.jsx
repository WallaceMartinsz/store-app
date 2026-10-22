import { cn } from '../../lib/utils';
import { ORDER_STATUS } from './orderStatus';

const StatusBadge = ({ status }) => {
  const config = ORDER_STATUS[status] || { label: status, className: '' };

  return (
    <span className={cn('inline-block whitespace-nowrap rounded-full px-2.5 py-[3px] text-xs font-semibold', config.className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
