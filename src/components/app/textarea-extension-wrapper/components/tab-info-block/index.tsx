import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { useLocation } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'

import { ActionPanel } from 'src/components/ui/action-panel'
import { AttachedPages } from './components/attached-pages'
import { TabInfoRow } from './components/tab-info-row'
import { AllTabsPanelContent } from './components/all-tabs-panel'
import PlusIcon from 'src/images/plus.svg?react'
import ArrowUpIcon from 'src/images/chevron.svg?react'

import styles from './styles.module.css'
import { mergeUniqueByUrl } from './utils'

function TabInfoHeaderComponent() {
  const {
    followUps,
    currentSearchQuery,
    pageDataRaw,
    selectedPageDataRaw,
    setSelectedPageData,
    removeSelectedPageData,
  } = useSearchStore(
    useShallow((state) => ({
      followUps: state.followUps,
      currentSearchQuery: state.currentSearchQuery,
      pageDataRaw: state.pageData,
      selectedPageDataRaw: state.selectedPageData,
      setSelectedPageData: state.setSelectedPageData,
      removeSelectedPageData: state.removeSelectedPageData,
    }))
  )
  const location = useLocation()
  const isSearchPage =
    location.pathname === '/search' &&
    currentSearchQuery &&
    location.search.includes(currentSearchQuery)
  const htmlPayloads = followUps?.flatMap((item) =>
    (item.html_payloads || [])?.map((p) => ({
      ...p,
      isSelected: true,
      isAddedToContext: true,
    }))
  )
  const isHtmlPayloads = htmlPayloads.length > 0 && isSearchPage

  const pageData = isHtmlPayloads
    ? mergeUniqueByUrl(htmlPayloads, pageDataRaw)
    : pageDataRaw
  const selectedPageData = isHtmlPayloads
    ? mergeUniqueByUrl(htmlPayloads, selectedPageDataRaw)
    : selectedPageDataRaw

  const activeTabItem = pageData?.find((el) => el?.active) || pageData?.[0]
  const [isOpen, setOpen] = useState(false)

  const handleToggleContext = useCallback(
    (tab_id?: number, isSelected?: boolean, isAddedToContext?: boolean) => {
      if (isAddedToContext) return
      if (!tab_id) return
      if (isSelected) {
        removeSelectedPageData(tab_id)
      } else {
        setSelectedPageData(tab_id)
      }
    },
    [setSelectedPageData, removeSelectedPageData]
  )

  const closeDropdown = () => setOpen(false)

  useEffect(() => {
    if (pageData?.length <= 1) setOpen(false)
  }, [pageData?.length])

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (isHtmlPayloads) {
        setOpen(true)
        return
      }

      const isNoPageSelected = selectedPageData.length === 0
      const isSinglePageSelectedAndAllPages =
        selectedPageData.length === 1 &&
        selectedPageData.length === pageData.length

      const hasSelectedPages = selectedPageData.length >= 1
      const hasMultiplePages = pageData.length > 1
      const shouldOpenDropdown = hasSelectedPages && hasMultiplePages

      if (isNoPageSelected || isSinglePageSelectedAndAllPages) {
        event.preventDefault()
        if (activeTabItem.tab_id)
          handleToggleContext(activeTabItem.tab_id, activeTabItem?.isSelected)
        return
      }

      if (shouldOpenDropdown) {
        setOpen(true)
      }
    },
    [
      activeTabItem,
      selectedPageData,
      pageData,
      handleToggleContext,
      setOpen,
      isHtmlPayloads,
    ]
  )

  const Trigger = useMemo(() => {
    if (!activeTabItem) return <div />

    const selectedCount = selectedPageData?.length || 0
    const hasMultipleSelected = selectedCount > 1
    const isSelectedActivePage = activeTabItem.isSelected && selectedCount === 1

    const renderTabInfoRow = isSelectedActivePage || selectedCount === 0
    const renderAttachedPages =
      (hasMultipleSelected || !isSelectedActivePage) && selectedCount > 0

    if (isHtmlPayloads)
      return (
        <div
          className={clsx(styles.wrapper, 'opacity-animation')}
          onClick={handleClick}
        >
          <AttachedPages selectedPageData={selectedPageData} />

          <button className={clsx(styles.button, { [styles.isOpen]: isOpen })}>
            <span>Add Tabs</span>
            <ArrowUpIcon
              className={clsx(styles.iconArrow, {
                [styles.iconRotate]: isOpen,
              })}
            />
          </button>
        </div>
      )

    return (
      <div
        className={clsx(styles.wrapper, 'opacity-animation')}
        onClick={handleClick}
      >
        {renderTabInfoRow && (
          <TabInfoRow
            favicon={activeTabItem.favicon}
            title={activeTabItem.title}
          />
        )}
        {renderAttachedPages && (
          <AttachedPages selectedPageData={selectedPageData} />
        )}

        <button className={clsx(styles.button, { [styles.isOpen]: isOpen })}>
          {pageData.length === 1 && activeTabItem.isSelected ? (
            <>
              <span>Remove from Context</span>
            </>
          ) : !selectedCount ? (
            <>
              <span>Add to Context</span>
              <PlusIcon className={styles.icon} />
            </>
          ) : (
            <>
              <span>Add Tabs</span>
              <ArrowUpIcon
                className={clsx(styles.iconArrow, {
                  [styles.iconRotate]: isOpen,
                })}
              />
            </>
          )}
        </button>
      </div>
    )
  }, [
    activeTabItem,
    pageData,
    selectedPageData,
    handleToggleContext,
    setOpen,
    isOpen,
    isHtmlPayloads,
  ])

  if (!pageData?.length || !activeTabItem) return null

  return (
    <ActionPanel
      open={isOpen}
      onOpenChange={setOpen}
      side='top'
      align='center'
      sideOffset={8}
      className={styles.wrapperActionPanel}
      trigger={Trigger}
    >
      <AllTabsPanelContent
        handleToggleContext={handleToggleContext}
        pageData={pageData}
        onClose={closeDropdown}
      />
    </ActionPanel>
  )
}

export const TabInfoHeader = memo(TabInfoHeaderComponent)
