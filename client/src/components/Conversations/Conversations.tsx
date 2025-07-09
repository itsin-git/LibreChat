import { useMemo, memo, type FC, useCallback } from 'react';
import throttle from 'lodash/throttle';
import { parseISO, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { useLocalize, TranslationKeys, useMediaQuery, useNewConvo } from '~/hooks';
import { TConversation, QueryKeys, Constants } from 'librechat-data-provider';
import type { TMessage } from 'librechat-data-provider';
import { groupConversationsByDate } from '~/utils';
import { Spinner, NewChatIcon } from '~/components/svg';
import { Button } from '~/components/ui';
import Convo from './Convo';
import store from '~/store';

interface ConversationsProps {
  conversations: Array<TConversation | null>;
  moveToTop: () => void;
  toggleNav: () => void;
  containerRef: React.RefObject<HTMLDivElement | List>;
  loadMoreConversations: () => void;
  isLoading: boolean;
  isSearchLoading: boolean;
  headerButtons?: React.ReactNode;
}

const LoadingSpinner = memo(() => {
  const localize = useLocalize();

  return (
    <div className="mx-auto mt-2 flex items-center justify-center gap-2">
      <Spinner className="text-text-primary" />
      <span className="animate-pulse text-text-primary">{localize('com_ui_loading')}</span>
    </div>
  );
});

const DateLabel: FC<{ groupName: string }> = memo(({ groupName }) => {
  const localize = useLocalize();
  return (
    <div className="mt-2 pl-2 pt-1 text-text-secondary" style={{ fontSize: '0.7rem' }}>
      {localize(groupName as TranslationKeys) || groupName}
    </div>
  );
});

DateLabel.displayName = 'DateLabel';

type FlattenedItem =
  | { type: 'header'; groupName: string }
  | { type: 'convo'; convo: TConversation }
  | { type: 'loading' };

const MemoizedConvo = memo(
  ({
    conversation,
    retainView,
    toggleNav,
    isLatestConvo,
  }: {
    conversation: TConversation;
    retainView: () => void;
    toggleNav: () => void;
    isLatestConvo: boolean;
  }) => {
    return (
      <Convo
        conversation={conversation}
        retainView={retainView}
        toggleNav={toggleNav}
        isLatestConvo={isLatestConvo}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.conversation.conversationId === nextProps.conversation.conversationId &&
      prevProps.conversation.title === nextProps.conversation.title &&
      prevProps.isLatestConvo === nextProps.isLatestConvo &&
      prevProps.conversation.endpoint === nextProps.conversation.endpoint
    );
  },
);

const Conversations: FC<ConversationsProps> = ({
  conversations: rawConversations,
  moveToTop,
  toggleNav,
  containerRef,
  loadMoreConversations,
  isLoading,
  isSearchLoading,
  headerButtons,
}) => {
  const localize = useLocalize();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { newConversation: newConvo } = useNewConvo();
  const { conversation } = store.useCreateConversationAtom();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const convoHeight = isSmallScreen ? 44 : 34;

  const filteredConversations = useMemo(
    () => rawConversations.filter(Boolean) as TConversation[],
    [rawConversations],
  );

  const groupedConversations = useMemo(
    () => groupConversationsByDate(filteredConversations),
    [filteredConversations],
  );

  const firstTodayConvoId = useMemo(
    () =>
      filteredConversations.find((convo) => convo.updatedAt && isToday(parseISO(convo.updatedAt)))
        ?.conversationId ?? undefined,
    [filteredConversations],
  );

  const flattenedItems = useMemo(() => {
    const items: FlattenedItem[] = [];
    groupedConversations.forEach(([groupName, convos]) => {
      items.push({ type: 'header', groupName });
      items.push(...convos.map((convo) => ({ type: 'convo' as const, convo })));
    });

    if (isLoading) {
      items.push({ type: 'loading' } as any);
    }
    return items;
  }, [groupedConversations, isLoading]);

  const cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: convoHeight,
        keyMapper: (index) => {
          const item = flattenedItems[index];
          if (item.type === 'header') {
            return `header-${index}`;
          }
          if (item.type === 'convo') {
            return `convo-${item.convo.conversationId}`;
          }
          if (item.type === 'loading') {
            return `loading-${index}`;
          }
          return `unknown-${index}`;
        },
      }),
    [flattenedItems, convoHeight],
  );

  const rowRenderer = useCallback(
    ({ index, key, parent, style }) => {
      const item = flattenedItems[index];
      if (item.type === 'loading') {
        return (
          <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
            {({ registerChild }) => (
              <div ref={registerChild} style={style}>
                <LoadingSpinner />
              </div>
            )}
          </CellMeasurer>
        );
      }
      return (
        <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
          {({ registerChild }) => (
            <div ref={registerChild} style={style}>
              {item.type === 'header' ? (
                <DateLabel groupName={item.groupName} />
              ) : item.type === 'convo' ? (
                <MemoizedConvo
                  conversation={item.convo}
                  retainView={moveToTop}
                  toggleNav={toggleNav}
                  isLatestConvo={item.convo.conversationId === firstTodayConvoId}
                />
              ) : null}
            </div>
          )}
        </CellMeasurer>
      );
    },
    [cache, flattenedItems, firstTodayConvoId, moveToTop, toggleNav],
  );

  const getRowHeight = useCallback(
    ({ index }: { index: number }) => cache.getHeight(index, 0),
    [cache],
  );

  const throttledLoadMore = useMemo(
    () => throttle(loadMoreConversations, 300),
    [loadMoreConversations],
  );

  const handleNewChat = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
      window.open('/c/new', '_blank');
      return;
    }
    queryClient.setQueryData<TMessage[]>(
      [QueryKeys.messages, conversation?.conversationId ?? Constants.NEW_CONVO],
      [],
    );
    queryClient.invalidateQueries([QueryKeys.messages]);
    newConvo();
    navigate('/c/new', { state: { focusChat: true } });
    if (isSmallScreen) {
      toggleNav();
    }
  }, [queryClient, conversation, newConvo, navigate, toggleNav, isSmallScreen]);

  const handleRowsRendered = useCallback(
    ({ stopIndex }: { stopIndex: number }) => {
      if (stopIndex >= flattenedItems.length - 8) {
        throttledLoadMore();
      }
    },
    [flattenedItems.length, throttledLoadMore],
  );

  return (
    <div className="relative flex h-full flex-col pb-2 text-sm text-text-primary">
      {isSearchLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-text-primary" />
          <span className="ml-2 text-text-primary">Loading...</span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          {/* AI 채팅 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 md:px-3 md:py-3 border-t border-gray-300 flex-shrink-0">
            <h2 className="text-base font-bold">AI 채팅</h2>
            <div className="flex items-center gap-2">
              {headerButtons}
              
              <Button
                size="icon"
                variant="outline"
                data-testid="new-chat-button"
                aria-label={localize('com_ui_new_chat')}
                className="rounded-full border-none bg-transparent hover:bg-transparent p-1 md:rounded-xl scale-95 hover:scale-105 transition-all duration-200 ease-in-out"
                onClick={handleNewChat}
              >
                <NewChatIcon className="icon-md md:h-6 md:w-6" />
              </Button>
            </div>
          </div>
          {/* 대화 리스트 */}
          <div className="flex-1">
            <AutoSizer>
            {({ width, height }) => (
              <List
                ref={containerRef as React.RefObject<List>}
                width={width}
                height={height}
                deferredMeasurementCache={cache}
                rowCount={flattenedItems.length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
                overscanRowCount={10}
                className="outline-none"
                style={{ outline: 'none' }}
                role="list"
                aria-label="Conversations"
                onRowsRendered={handleRowsRendered}
                tabIndex={-1}
              />
            )}
            </AutoSizer>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Conversations);
