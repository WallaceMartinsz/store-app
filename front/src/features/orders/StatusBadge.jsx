import { ORDER_STATUS } from './orderStatus';

const StatusBadge = ({ status }) => {
  const config = ORDER_STATUS[status] || { label: status, className: '' };

  return <span className={`status-badge ${config.className}`}>{config.label}</span>;
};

export default StatusBadge;
