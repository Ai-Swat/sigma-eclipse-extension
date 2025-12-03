import { useCallback, useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { debounce } from 'src/libs/debounce';
import { useChatContext } from '@/sidepanel/contexts/chatContext.tsx';
import CircleButton from '@/components/ui/circle-button';
import ArrowIcon from 'src/images/arrow-left.svg?react';

import css from './styles.module.css';

export const SEARCH_SCROLL_CONTAINER = 'chat-messages-container';

const DEBOUNCE_DELAY = 100;
const SCROLL_SHIFT_THRESHOLD = 200;

export const ScrollDownButton = () => {
  const { activeChat } = useChatContext();
  const isChatMessages = !!activeChat?.messages.length;
  const lastItemId = activeChat?.id;

  const [canScroll, setCanScroll] = useState(false);

  // memoize debounced function to prevent recreation on every rerender
  const checkCanScroll = useMemo(
    () =>
      debounce(() => {
        const scrollContainer = document.getElementById(SEARCH_SCROLL_CONTAINER);

        if (scrollContainer) {
          const isScrolledToBottom =
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight - SCROLL_SHIFT_THRESHOLD;

          setCanScroll(!isScrolledToBottom);
        }
      }, DEBOUNCE_DELAY),
    []
  );

  useEffect(() => {
    const scrollContainer = document.getElementById(SEARCH_SCROLL_CONTAINER);
    if (!scrollContainer) return;

    checkCanScroll();

    scrollContainer.addEventListener('scroll', checkCanScroll);
    window.addEventListener('resize', checkCanScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', checkCanScroll);
      window.removeEventListener('resize', checkCanScroll);
    };
    // update when last element changes
  }, [lastItemId, checkCanScroll]);

  // memoize handler
  const scrollDown = useCallback(() => {
    const scrollContainer = document.getElementById(SEARCH_SCROLL_CONTAINER);

    scrollContainer?.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  if (!canScroll) return null;
  if (!isChatMessages) return null;

  return (
    <CircleButton
      className={clsx(css.scrollButton, 'fade-in')}
      onClick={scrollDown}
      label="Scroll to latest message"
    >
      <ArrowIcon className={css.arrowIcon} />
    </CircleButton>
  );
};
