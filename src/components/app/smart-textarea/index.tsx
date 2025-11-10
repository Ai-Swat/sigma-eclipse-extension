import React, {
  forwardRef,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import clsx from 'clsx'
import loadable from '@loadable/component'

import { mergeRefs } from 'src/libs/merge-refs'
import { useFileContext } from 'src/contexts/fileContext'
import useClickOutside from 'src/libs/use/use-click-outside'
import useTextareaSuggestions from './hooks/use-textarea-suggestions'
import { useTextareaLayout } from './hooks/use-textarea-layout'

import { SendButton } from 'src/components/app/smart-textarea/components/send-button'
import { FileList } from 'src/components/app/drag-n-drop-wrapper/components/file-list'
import { FileUploadButton } from './components/file-upload-button'

import css from './styles.module.css'

const TextareaOptionsList = loadable(
  () => import('./components/textarea-options-list')
)

type SmartTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'onEnter'
> & {
  value: string
  onChange: (value: string, isSkipFocus?: boolean) => void
  onClear?: () => void
  onEnter: (value?: string) => void
  placeholder?: string
  isActiveSendButton: boolean
  followup_id?: string
  created_at?: string
  isEnd?: boolean
  isLimitExceeded?: boolean
  isDisabled?: boolean
  isMainPage?: boolean
  setIsMobileTitleHidden?: (status: boolean) => void
  isWaitingUserClarification?: boolean
  isAgentReplyRequested?: boolean
}

const SmartTextarea = forwardRef<HTMLTextAreaElement, SmartTextareaProps>(
  (
    {
      value,
      onChange,
      onClear,
      onEnter,
      placeholder,
      isActiveSendButton,
      followup_id,
      created_at,
      isEnd,
      isLimitExceeded,
      isDisabled,
      isMainPage,
      setIsMobileTitleHidden,
      isWaitingUserClarification,
      isAgentReplyRequested,
      className,
      ...otherProps
    },
    ref
  ) => {
    const { files, uploadedFiles, handlePaste, handleRemoveFile } =
      useFileContext()

    const innerRef = useRef<HTMLTextAreaElement | null>(null)
    const wrapperInputRef = useRef<HTMLDivElement>(null)

    const isFiles = files.length > 0 || uploadedFiles.length > 0

    const { isGradientShow, handleInputHeight } = useTextareaLayout()

    const {
      options,
      cursor,
      setPreselected,
      onKeyDownInput,
      selectOption,
      isOpenSuggestions,
      closeSuggestions,
      handleOpenSuggestions,
      onChangeInput,
    } = useTextareaSuggestions({
      value,
      onChange,
      onEnter,
      selectedMode: undefined,
      isMainPage,
    })

    const isShowOptions = Boolean(
      isMainPage &&
        isOpenSuggestions &&
        options.length > 0 &&
        false // disabled for extension
    )

    useClickOutside(innerRef, closeSuggestions)

    // скрываем мобильный title на главной
    useEffect(() => {
      if (!isMainPage) return
      setIsMobileTitleHidden?.(isShowOptions)
    }, [isShowOptions, isMainPage])

    // для управления высотой margin-bottom последнего фоллоуапа
    useEffect(() => {
      const el = wrapperInputRef.current
      if (!el) return
      const observer = new ResizeObserver(() => {
        const height = el.clientHeight
        document.documentElement.style.setProperty(
          '--full-textarea-height',
          `${height}px`
        )
      })
      observer.observe(el)
      return () => observer.disconnect()
    }, [])

    const handleFocus = useCallback(() => {
      handleOpenSuggestions()
    }, [handleOpenSuggestions])

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
                <FileList
                  files={[...uploadedFiles, ...files]}
                  onRemove={handleRemoveFile}
                />
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
                    onFocus={handleFocus}
                    className={css.textarea}
                    autoComplete='off'
                    autoCapitalize='off'
                    tabIndex={0}
                    rows={1}
                autoFocus={true}
                    name='textarea-dropdown'
                    {...otherProps}
                  />
                  {isGradientShow && <div className={css.gradientBottom} />}
            </div>

            <div className={css.leftButtonWrapper}>
              <FileUploadButton
                isDisabled={isDisabled}
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
                />
            </div>
          </div>

          {isShowOptions && (
            <div className={clsx(css.textareaOptionsList, 'fade-in')}>
              <TextareaOptionsList
                options={options}
                cursor={cursor}
                setPreselected={setPreselected}
                value={value}
                selectOption={selectOption}
                selectedMode={selectedMode}
              />
            </div>
          )}
        </div>
      </>
    )
  }
)

export default React.memo(SmartTextarea)
