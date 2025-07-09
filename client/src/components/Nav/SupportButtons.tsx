import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleHelpIcon, MessagesSquared } from '~/components/svg';

const SupportButtons = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 space-y-1">
      <div className="grid grid-cols-2 gap-2 px-3">
        {/* FAQ 버튼 */}
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-tertiary transition-colors"
          onClick={() => navigate('/support/faq')}
        >
          <CircleHelpIcon className="mr-2 h-4 w-4" />
          <span>FAQ</span>
        </button>

        {/* 간편상담 버튼 */}
        <button
          className="flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-tertiary transition-colors"
          onClick={() => navigate('/support/consultation')}
        >
          <MessagesSquared className="mr-2 h-4 w-4" />
          <span>간편상담</span>
        </button>
      </div>
    </div>
  );
});

SupportButtons.displayName = 'SupportButtons';

export default SupportButtons;