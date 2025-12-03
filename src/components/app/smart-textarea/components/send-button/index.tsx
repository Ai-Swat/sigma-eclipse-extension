import React, { memo, useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import ArrowIcon from 'src/images/arrow-left.svg?react';
import css from './styles.module.css';

export const SendButton = memo(
  ({
    onClick,
    isActive,
    followup_id,
    disabled,
    isEnd,
    isLimitExceeded,
    created_at,
    isWaitingUserClarification,
    isExtension,
    isGenerating,
    onStopGeneration,
  }: {
    onClick?: () => void;
    isActive?: boolean;
    followup_id?: string;
    thread_id?: string;
    disabled?: boolean;
    isEnd?: boolean;
    isLimitExceeded?: boolean;
    created_at?: string;
    isWaitingUserClarification?: boolean;
    isExtension?: boolean;
    isGenerating?: boolean;
    onStopGeneration?: () => void;
  }) => {
    // Simplified stubs for extension
    const isStartSearch = false;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (!isActive || disabled) return;
        onClick?.();
        setIsStopButtonClicked(false); // STOP button is shown. ✅
      },
      [isActive, disabled, onClick]
    );

    const [isStopButtonClicked, setIsStopButtonClicked] = useState(false);
    const [isContinuedFollowup, setIsContinuedFollowup] = useState(false);

    // If followup_id or created_at changed,
    // STOP button can appear again. ✅
    useEffect(() => {
      requestAnimationFrame(() => {
        setIsStopButtonClicked(false);
      });
    }, [followup_id, created_at]);

    // Conditions breakdown:
    // STOP is hidden if isEnd = true. ✅
    // STOP is hidden if !isStartSearch && isLimitExceeded. ✅
    // STOP is hidden if isWaitingUserClarification = true and user query is entered. ✅
    // In all other cases → isShow = true → STOP button is shown. ✅
    useEffect(() => {
      if (!followup_id) return;

      let isShow = !isEnd;

      if (!isStartSearch && isLimitExceeded) {
        isShow = false;
      }

      if (isWaitingUserClarification !== undefined && isWaitingUserClarification && isActive) {
        isShow = false;
      }

      setIsContinuedFollowup(isShow);
    }, [isEnd, followup_id, isLimitExceeded, isWaitingUserClarification, isStartSearch, isActive]);

    // Use isGenerating for extension, fallback to old logic for main app
    const shouldShowStopButton =
      isGenerating !== undefined ? isGenerating : !isStopButtonClicked && isContinuedFollowup;

    const handleButtonClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (shouldShowStopButton) {
          // Stop generation
          if (isGenerating && onStopGeneration) {
            onStopGeneration();
          }
        } else {
          // Send message
          handleClick(event);
        }
      },
      [shouldShowStopButton, isGenerating, onStopGeneration, handleClick]
    );

    return (
      <div
        className={clsx({
          [css.wrapper]: !shouldShowStopButton,
          [css.stopButton]: shouldShowStopButton,
          [css.notActive]: !isActive && !shouldShowStopButton,
          [css.isExtension]: isExtension,
        })}
        onClick={handleButtonClick}
      >
        {!shouldShowStopButton && <ArrowIcon className={css.icon} />}
      </div>
    );
  },
  (prevProps, nextProps) => {
    let shouldRerender = false;

    // List of key props for comparison
    const keys: (keyof typeof prevProps)[] = [
      'onClick',
      'isActive',
      'disabled',
      'followup_id',
      'thread_id',
      'created_at',
      'isEnd',
      'isLimitExceeded',
      'isWaitingUserClarification',
      'isGenerating',
      'onStopGeneration',
    ];

    keys.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        shouldRerender = true;
      }
    });

    // true — props are equal, no rerender needed
    // false — props changed, rerender needed
    return !shouldRerender;
  }
);

SendButton.displayName = 'SendButton';
