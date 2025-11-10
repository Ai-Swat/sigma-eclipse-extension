import { useEffect, useState } from 'react'

import Dropdown, { DropdownItemType } from 'src/components/ui/dropdown'
import { ImprovementOptionType } from 'src/routes/search/_components/improvements'
import { Flag } from 'src/components/ui/flag'

interface IProps {
  items: ImprovementOptionType[]
  title?: string
  onSelect: (option: ImprovementOptionType, text?: string) => void
}

export function LanguageDropdown({ items, title, onSelect }: IProps) {
  const languageItems: DropdownItemType[] = items.map(
    (el) =>
      ({
        title: el.title,
        value: el.countryCode,
        flag: el.countryCode && <Flag code={el.countryCode} />,
      }) as DropdownItemType
  )

  const [activeItem, setActiveItem] = useState<DropdownItemType>(
    languageItems[0]
  )

  useEffect(() => {
    const selectedLang = items.find((el) => el.isSelected)
    if (selectedLang) {
      const newLang = languageItems.find(
        (el) => el.value === selectedLang.countryCode
      )
      if (newLang) setActiveItem(newLang)
    }
  }, [items])

  const handleSelect = async (type: DropdownItemType) => {
    if (activeItem === type) return
    setActiveItem(type)
    const newLang = items.find((el) => el.countryCode === type.value)
    if (newLang) onSelect(newLang)
  }

  const sortedLanguageItems = [
    ...languageItems.filter((el) => el.value === activeItem.value),
    ...languageItems.filter((el) => el.value !== activeItem.value),
  ]

  return (
    <Dropdown
      activeItem={activeItem}
      items={sortedLanguageItems}
      title={title}
      onOptionSelect={handleSelect}
      isNoDesktopTitle
      isOverlayBlocker={false}
      side='bottom'
    />
  )
}
