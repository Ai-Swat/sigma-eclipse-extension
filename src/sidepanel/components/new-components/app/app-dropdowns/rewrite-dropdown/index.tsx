import { useEffect, useState } from 'react'
import { FollowUpType } from 'src/store/types'
import { useEvent } from 'src/libs/use/use-event'
import { useRewriteFollowUp } from 'src/libs/use/use-rewrite-follow-up'
import Dropdown, { DropdownItemType } from 'src/components/ui/dropdown'
import { searchDropdownItems } from 'src/components/app/smart-textarea/components/mode-dropdown/utils'
import { useSettingsStore } from 'src/store/settings'
import RewriteButton from 'src/components/ui/rewrite-button'

interface IProps {
  followup_type?: FollowUpType
  id?: string
  parent_id?: string
  text_generation_settings?: any
  image_generation_settings?: any
  isExtendingTitle?: boolean
  isFirst?: boolean
  onCloseImprovementsBlock: () => void
}

export function RewriteDropdown({
  followup_type,
  id,
  parent_id,
  isExtendingTitle,
  text_generation_settings,
  image_generation_settings,
  isFirst,
  onCloseImprovementsBlock,
}: IProps) {
  const items: DropdownItemType[] = searchDropdownItems.filter(
    (el) => ![FollowUpType.AUTO, FollowUpType.DEEP_RESEARCH].includes(el.value)
  )

  const isExtension = useSettingsStore((state) => state.isExtension)

  const [activeItem, setActiveItem] = useState<DropdownItemType>(items[0])

  const { callRewriteFollowUp } = useRewriteFollowUp()

  const handleSearch = useEvent(async (newItem: DropdownItemType) => {
    if (isFirst) window.scrollTo({ top: 0, behavior: 'smooth' })

    await callRewriteFollowUp({
      id,
      parent_id,
      query_type: newItem.value,
      text_generation_settings,
      image_generation_settings,
      was_panel_used: false,
    })

    setActiveItem(newItem)

    // закрываем блок Improvements если открыт
    onCloseImprovementsBlock()
  })

  useEffect(() => {
    const newItem = searchDropdownItems.find((el) => el.value === followup_type)

    if (newItem) {
      setActiveItem(newItem)
    } else {
      setActiveItem(searchDropdownItems[0])
    }
  }, [followup_type])

  const hideDropdown =
    followup_type === FollowUpType.WEB_AGENT ||
    followup_type === FollowUpType.DEEP_RESEARCH ||
    followup_type === FollowUpType.TELEGRAM

  if (hideDropdown) return null

  if (isExtension) {
    return <RewriteButton onClick={() => handleSearch(activeItem)} />
  }

  return (
    <Dropdown
      activeItem={activeItem}
      items={items}
      title={'Regenerate using'}
      onOptionSelect={handleSearch}
      isExtendingTitle={isExtendingTitle}
      tooltipTitle={'Regenerate'}
    />
  )
}
