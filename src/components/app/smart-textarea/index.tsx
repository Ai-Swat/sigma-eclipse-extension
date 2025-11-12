import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from 'react';
import clsx from 'clsx';

import { mergeRefs } from 'src/libs/merge-refs';
import { useFileContext } from 'src/contexts/fileContext';
import { useTextareaLayout } from './hooks/use-textarea-layout';

import { SendButton } from 'src/components/app/smart-textarea/components/send-button';
import { FileList } from 'src/components/app/drag-n-drop-wrapper/components/file-list';
import { FileUploadButton } from './components/file-upload-button';

import css from './styles.module.css';
import LanguageDropdown from '@/sidepanel/components/LanguageDropdown.tsx';
import { useEvent } from '@/libs/use/use-event.ts';
import { wait } from '@/libs/coxy-utils.ts';

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
    const { files, uploadedFiles, handlePaste, handleRemoveFile } = useFileContext();

    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const wrapperInputRef = useRef<HTMLDivElement>(null);

    const isFiles = files.length > 0 || uploadedFiles.length > 0;

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

    // для управления высотой margin-bottom последнего фоллоуапа
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
                <FileList files={[...uploadedFiles, ...files]} onRemove={handleRemoveFile} />
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
                name="textarea-dropdown"
                {...otherProps}
              />
              {isGradientShow && <div className={css.gradientBottom} />}
            </div>

            <div className={css.leftButtonWrapper}>
              <FileUploadButton isDisabled={isDisabled} />

              <LanguageDropdown />
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
                isGenerating={isGenerating}
                onStopGeneration={onStopGeneration}
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
