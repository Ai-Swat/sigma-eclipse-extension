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
import {
  searchDropdownItems,
  searchDropdownItemsExtension,
} from 'src/components/app/smart-textarea/components/mode-dropdown/utils'
import { useSettingsStore } from 'src/store/settings'
import { useFileContext } from 'src/contexts/fileContext'
import { useDictateContext } from 'src/contexts/dictateContext'
import useClickOutside from 'src/libs/use/use-click-outside'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import useTextareaSuggestions from './hooks/use-textarea-suggestions'
import { useTextareaLayout } from './hooks/use-textarea-layout'

import { SendButton } from 'src/components/app/smart-textarea/components/send-button'
import { DropdownItemType } from 'src/components/ui/dropdown'
import { DictateButton } from 'src/components/app/smart-textarea/components/dictate-button'
import { SubmitDictateButton } from 'src/components/app/smart-textarea/components/submit-dictate-button'
import VoiceEqualizer from 'src/components/app/voice-equalizer'
import { FileList } from 'src/components/app/drag-n-drop-wrapper/components/file-list'
import { ModeDropdown } from './components/mode-dropdown'
import { SelectedModeButton } from './components/selected-mode-button'

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
  searchType: {
    value: DropdownItemType | undefined
    set: (item: DropdownItemType) => void
  }
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
      searchType,
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
    const isMobile = useMobileDetect()
    const { files, uploadedFiles, handlePaste, handleRemoveFile } =
      useFileContext()
    const { isRecording, transcribedText, clearTranscribedText } =
      useDictateContext()
    const isExtension = useSettingsStore((state) => state.isExtension)
    const dropdownItems = isExtension
      ? searchDropdownItemsExtension
      : searchDropdownItems

    const innerRef = useRef<HTMLTextAreaElement | null>(null)
    const wrapperInputRef = useRef<HTMLDivElement>(null)

    const isFiles = files.length > 0 || uploadedFiles.length > 0
    const selectedMode = searchType.value?.value

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
      selectedMode,
      isMainPage,
    })

    const isShowOptions = Boolean(
      isMainPage &&
        isOpenSuggestions &&
        !isRecording &&
        options.length > 0 &&
        !isExtension
    )

    useClickOutside(innerRef, closeSuggestions)

    // скрываем мобильный title на главной
    useEffect(() => {
      if (!isMainPage) return
      setIsMobileTitleHidden?.(isShowOptions)
    }, [isShowOptions, isMainPage])

    useEffect(() => {
      if (transcribedText) {
        onChange(transcribedText, true)
        clearTranscribedText()
      }
    }, [transcribedText])

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

    const handleDeleteActiveSearchType = useCallback(() => {
      searchType.set(dropdownItems[0])
      if (!isMobile) innerRef.current?.focus()
    }, [searchType, isMobile])

    const handleSetActiveSearchType = useCallback(
      (item: DropdownItemType) => {
        const isAlreadySelected = searchType.value?.value === item.value
        if (isAlreadySelected) {
          searchType.set(dropdownItems[0])
        } else {
          searchType.set(item)
        }

        if (!isMobile) innerRef.current?.focus()
      },
      [searchType, isMobile]
    )

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
              {isRecording ? (
                <VoiceEqualizer />
              ) : (
                <>
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
                    autoFocus={isExtension}
                    name='textarea-dropdown'
                    {...otherProps}
                  />
                  {isGradientShow && <div className={css.gradientBottom} />}
                </>
              )}
            </div>

            <div className={css.leftButtonWrapper}>
              <ModeDropdown
                isExtension={isExtension}
                activeSearchType={searchType.value}
                setActiveSearchType={handleSetActiveSearchType}
                isDisabled={isDisabled}
              />

              {!isAgentReplyRequested && (
                <SelectedModeButton
                  onDelete={handleDeleteActiveSearchType}
                  item={searchType.value}
                  isExtension={isExtension}
                />
              )}
            </div>

            <div className={css.rightButtonWrapper}>
              <DictateButton onClick={onClear} />

              {isRecording ? (
                <SubmitDictateButton />
              ) : (
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
              )}
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
