import { memo } from 'react';
import { cn } from '~/utils';

interface MonitoringItemProps {
  id: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const MonitoringItem = memo(({ id, label, onClick, isActive = false }: MonitoringItemProps) => {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center rounded-lg px-6 py-2 text-sm transition-colors',
        isActive
          ? 'bg-surface-active text-text-primary-alt'
          : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <span className="flex-1">{label}</span>
    </div>
  );
});

MonitoringItem.displayName = 'MonitoringItem';

export default MonitoringItem;