import { memo } from 'react';
import { useParams } from 'react-router-dom';

const SupportPage = memo(() => {
  const { page } = useParams<{ page: string }>();

  const getPageTitle = (pageName: string) => {
    switch (pageName) {
      case 'faq':
        return 'FAQ';
      case 'consultation':
        return '간편상담';
      default:
        return '지원 페이지';
    }
  };

  const getPageDescription = (pageName: string) => {
    switch (pageName) {
      case 'faq':
        return '자주 묻는 질문과 답변을 확인할 수 있습니다.';
      case 'consultation':
        return '간편하게 상담을 요청할 수 있습니다.';
      default:
        return '고객 지원 서비스를 제공합니다.';
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-surface-primary">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-text-primary">
          {getPageTitle(page || '')}
        </h1>
        <p className="text-lg text-text-secondary">
          {getPageDescription(page || '')}
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          이 페이지는 현재 개발 중입니다.
        </p>
      </div>
    </div>
  );
});

SupportPage.displayName = 'SupportPage';

export default SupportPage;