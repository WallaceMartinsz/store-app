import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Brand = ({ to = '/', size = 'default', className, children }) => (
  <Link
    className={cn(
      'font-bold tracking-[-0.3px] text-foreground no-underline',
      size === 'lg' ? 'text-2xl' : 'text-xl',
      className
    )}
    to={to}
  >
    Load<span className="text-primary">out</span>
    {children}
  </Link>
);

export default Brand;
