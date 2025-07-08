import { memo } from 'react';
import { useParams } from 'react-router-dom';

const BlankPage = memo(() => {
  const { page } = useParams<{ page: string }>();
  
  const getPageTitle = (pageName: string) => {
    switch (pageName) {
      case 'asset-management':
        return '자산관리';
      case 'siem':
        return 'SIEM';
      case 'cmdb':
        return 'CMDB 정보';
      default:
        return '관제 페이지';
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-surface-primary">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-text-primary">
          {getPageTitle(page || '')}
        </h1>
        <p className="text-lg text-text-secondary">
          이 페이지는 현재 개발 중입니다.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          보안 관제 관련 정보를 제공할 예정입니다.
        </p>
      </div>
    </div>
  );
});

BlankPage.displayName = 'BlankPage';

export default BlankPage;