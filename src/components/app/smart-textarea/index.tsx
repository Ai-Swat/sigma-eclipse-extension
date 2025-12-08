import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import { wait } from '@/libs/coxy-utils.ts';
import clsx from 'clsx';

import { mergeRefs } from 'src/libs/merge-refs';
import { useFileContext } from '@/sidepanel/contexts/fileContext';
import { useTextareaLayout } from './hooks/use-textarea-layout';

import { SendButton } from 'src/components/app/smart-textarea/components/send-button';
import { FileList } from '@/components/app/files/components/file-list';
import { FileUploadButton } from './components/file-upload-button';
import LanguageDropdown from '@/sidepanel/components/LanguageDropdown.tsx';
import { useEvent } from '@/libs/use/use-event.ts';
import { SummarizePageButton } from '@/components/app/smart-textarea/components/summarize-page-button';
import { TEXTAREA_ID } from '@/sidepanel/App.tsx';

import css from './styles.module.css';

type SmartTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'onEnter'
> & {
  value: string;
  onChange: (value: string, isSkipFocus?: boolean) => void;
  onClear?: () => void;
  onEnter: (value?: string) => void;
  placeholder?: string;
  isActiveSendButton: boolean;
  followup_id?: string;
  created_at?: string;
  isEnd?: boolean;
  isLimitExceeded?: boolean;
  isDisabled?: boolean;
  isMainPage?: boolean;
  setIsMobileTitleHidden?: (status: boolean) => void;
  isWaitingUserClarification?: boolean;
  isAgentReplyRequested?: boolean;
  isGenerating?: boolean;
  onStopGeneration?: () => void;
};

const SmartTextarea = forwardRef<HTMLTextAreaElement, SmartTextareaProps>(
  (
    {
      value,
      onChange,
      onEnter,
      placeholder,
      isActiveSendButton,
      followup_id,
      created_at,
      isEnd,
      isLimitExceeded,
      isDisabled,
      isWaitingUserClarification,
      isGenerating,
      onStopGeneration,
      className,
      ...otherProps
    },
    ref
  ) => {
    const { uploadedFiles, handlePaste, handleRemoveFile } = useFileContext();

    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const wrapperInputRef = useRef<HTMLDivElement>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [stopSummarization, setStopSummarization] = useState<() => void>(() => () => {});

    const isFiles = uploadedFiles.length > 0;

    const { isGradientShow, handleInputHeight } = useTextareaLayout();

    const onKeyDownInput = useEvent(async (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && onEnter) {
        e.preventDefault();
        onEnter();
        await wait(100);
      }
    });

    const onChangeInput = useEvent((e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    });

    // for managing margin-bottom height of the last followup
    useEffect(() => {
      const el = wrapperInputRef.current;
      if (!el) return;
      const observer = new ResizeObserver(() => {
        const height = el.clientHeight;
        document.documentElement.style.setProperty('--full-textarea-height', `${height}px`);
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (!innerRef.current) return;

      const ta = innerRef.current;

      const resize = () => {
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      };

      resize();

      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('resize', resize);
      };
    }, [value]);

    return (
      <>
        <div className={css.root} ref={wrapperInputRef}>
          <div
            className={clsx(
              css.searchInputWrapper,
              {
                [css.isFiles]: isFiles,
              },
              className
            )}
          >
            {isFiles && (
              <div className={css.fileListWrapper}>
                <FileList files={uploadedFiles} onRemove={handleRemoveFile} />
              </div>
            )}

            <div className={css.textareaWrapper}>
              {isGradientShow && <div className={css.gradientTop} />}
              <textarea
                ref={mergeRefs([ref, innerRef])}
                value={value}
                placeholder={placeholder}
                onChange={onChangeInput}
                onPaste={handlePaste}
                onKeyDown={onKeyDownInput}
                onInput={handleInputHeight}
                className={css.textarea}
                autoComplete="off"
                autoCapitalize="off"
                tabIndex={0}
                rows={1}
                autoFocus={true}
                id={TEXTAREA_ID}
                name="textarea-dropdown"
                {...otherProps}
              />
              {isGradientShow && <div className={css.gradientBottom} />}
            </div>

            <div className={css.leftButtonWrapper}>
              <FileUploadButton isDisabled={isDisabled} />

              <LanguageDropdown />

              <SummarizePageButton
                setIsSummarizing={setIsSummarizing}
                setHandleStopGeneration={setStopSummarization}
              />
            </div>

            <div className={css.rightButtonWrapper}>
              <SendButton
                disabled={isDisabled}
                followup_id={followup_id}
                isActive={isActiveSendButton}
                onClick={onEnter}
                isEnd={isEnd}
                isLimitExceeded={isLimitExceeded}
                created_at={created_at}
                isWaitingUserClarification={isWaitingUserClarification}
                isGenerating={isGenerating || isSummarizing}
                onStopGeneration={isSummarizing ? stopSummarization : onStopGeneration}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);

SmartTextarea.displayName = 'SmartTextarea';

export default React.memo(SmartTextarea);
