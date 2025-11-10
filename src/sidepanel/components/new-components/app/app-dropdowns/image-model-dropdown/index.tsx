import { useEffect, useState } from 'react'

import Dropdown, { DropdownItemType } from 'src/components/ui/dropdown'
import { ImprovementOptionType } from 'src/routes/search/_components/improvements'
import { ImageModel, modelTitle } from 'src/libs/image-improvements-utils'

import RecraftIcon from './images/recraft.svg?react'
import DalleIcon from './images/dalle.svg?react'
import StableIcon from './images/stable.svg?react'
import FluxIcon from './images/flux.svg?react'

const ImageIcon = ({ title }: { title: string }) => {
  if (title === ImageModel.RECRAFT) return <RecraftIcon className='br100' />
  if (title === ImageModel.DALLE) return <DalleIcon className='br100' />
  if (title === ImageModel.STABLE_DIFFUSION)
    return <StableIcon className='br100' />
  if (title === ImageModel.FLUX) return <FluxIcon className='br100' />
  return <RecraftIcon className='br100' />
}

interface IProps {
  items: ImprovementOptionType[]
  title?: string
  onSelect: (option: ImprovementOptionType, text?: string) => void
}

export function ImageModelDropdown({ items, title, onSelect }: IProps) {
  const modelItems: DropdownItemType[] = items.map(
    (el) =>
      ({
        title: modelTitle(el.title),
        value: el.title,
        flag: el.title && <ImageIcon title={el.title} />,
      }) as DropdownItemType
  )

  const [activeItem, setActiveItem] = useState<DropdownItemType>(modelItems[0])

  useEffect(() => {
    const selectedModel = items.find((el) => el.isSelected)
    if (selectedModel) {
      const newModel = modelItems.find((el) => el.value === selectedModel.title)
      if (newModel) setActiveItem(newModel)
    }
  }, [items])

  const handleSelect = async (type: DropdownItemType) => {
    if (activeItem === type) return
    setActiveItem(type)
    const newModel = items.find((el) => el.title === type.value)
    if (newModel) onSelect(newModel)
  }

  const sortedModelItems = [
    ...modelItems.filter((el) => el.title === activeItem.title),
    ...modelItems.filter((el) => el.title !== activeItem.title),
  ]

  return (
    <Dropdown
      activeItem={activeItem}
      items={sortedModelItems}
      title={title}
      onOptionSelect={handleSelect}
      isNoDesktopTitle
      isOverlayBlocker={false}
      side='bottom'
    />
  )
}
