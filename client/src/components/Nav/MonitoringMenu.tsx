import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useLocalize } from '~/hooks';
import MonitoringItem from './MonitoringItem';

const monitoringItems = [
  { id: 'asset-management', label: '자산관리', path: '/monitoring/asset-management' },
  { id: 'siem', label: 'SIEM', path: '/monitoring/siem' },
  { id: 'cmdb', label: 'CMDB 정보', path: '/monitoring/cmdb' },
];

const MonitoringMenu = memo(() => {
  const localize = useLocalize();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="mb-4">
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-tertiary"
        onClick={toggleExpanded}
      >
        <span>관제 페이지</span>
        {isExpanded ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-1 space-y-1">
          {monitoringItems.map((item) => (
            <MonitoringItem
              key={item.id}
              id={item.id}
              label={item.label}
              onClick={() => handleItemClick(item.path)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

MonitoringMenu.displayName = 'MonitoringMenu';

export default MonitoringMenu;