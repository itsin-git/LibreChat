import React, { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys, Constants } from 'librechat-data-provider';
import type { TMessage, TStartupConfig } from 'librechat-data-provider';
import { NewChatIcon, MobileSidebar, Sidebar } from '~/components/svg';
import { getDefaultModelSpec, getModelSpecPreset } from '~/utils';
import { TooltipAnchor, Button } from '~/components/ui';
import { useLocalize, useNewConvo } from '~/hooks';
import store from '~/store';

export default function NewChat({
  index = 0,
  toggleNav,
  subHeaders,
  isSmallScreen,
  headerButtons,
}: {
  index?: number;
  toggleNav: () => void;
  isSmallScreen?: boolean;
  subHeaders?: React.ReactNode;
  headerButtons?: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  /** Note: this component needs an explicit index passed if using more than one */
  const { newConversation: newConvo } = useNewConvo(index);
  const navigate = useNavigate();
  const localize = useLocalize();
  const { conversation } = store.useCreateConversationAtom(index);

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
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
    },
    [queryClient, conversation, newConvo, navigate, toggleNav, isSmallScreen],
  );

  return (
    <> 
      {/* flex items-center justify-between py-[2px] md:py-2 -> border-b border-surface-border*/}
      <div className="flex items-center justify-between px-4 py-2 md:px-5 md:py-3">
        <h2 className="text-white font-bold">
          이츠인<span className="ml-1">( Itsin )</span>
        </h2>
        <TooltipAnchor
          //title="좌측 사이드 메뉴 토글 버튼"
          description={localize('com_nav_close_sidebar')}
          render={
            <Button
              size="icon"
              variant="outline"
              data-testid="close-sidebar-button"
              aria-label={localize('com_nav_close_sidebar')}
              // className="rounded-full border-none bg-transparent p-2 hover:bg-surface-hover md:rounded-xl"
              className="rounded-full border-none bg-transparent hover:bg-transparent p-1 md:rounded-xl scale-95 hover:scale-105 transition-all duration-200 ease-in-out"
              onClick={toggleNav}
            >
              {/* 사이드바 아이콘 색 변경 */}
              <Sidebar className="max-md:hidden text-white" />
              <MobileSidebar className="m-1 inline-flex size-10 items-center justify-center md:hidden text-white" />
            </Button>
          }
        />
        {/* 북마크, 새 채팅 버튼 숨김 */}
        <div className="flex hidden">
          {/* 북마크버튼 */}
          {headerButtons}

          {/* 새 채팅 버튼 */}
          <TooltipAnchor
            description={localize('com_ui_new_chat')}
            render={
              <Button
                // title="새 채팅 버튼"
                size="icon"
                variant="outline"
                data-testid="nav-new-chat-button"
                aria-label={localize('com_ui_new_chat')}
                className="rounded-full border-none bg-transparent p-2 hover:bg-surface-hover md:rounded-xl"
                onClick={clickHandler}
              >
                <NewChatIcon className="icon-md md:h-6 md:w-6" />
              </Button>
            }
          />
        </div>
      </div>
      {subHeaders != null ? subHeaders : null}
    </>
  );
}
