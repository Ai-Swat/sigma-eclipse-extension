import { useShallow } from 'zustand/react/shallow'
import { useSidebarStore } from 'src/store/sidebar'
import BaseButton from 'src/components/ui/base-button'
import { TooltipDefault } from 'src/components/ui/tooltip'
import SidebarIcon from 'src/images/sidebar.svg?react'

export default function OpenSidebarButton() {
  const { isOpenSidebar, toggleSidebar } = useSidebarStore(
    useShallow((state) => ({
      isOpenSidebar: state.isOpenSidebar,
      toggleSidebar: state.toggleSidebar,
    }))
  )

  return (
    <TooltipDefault text={isOpenSidebar ? 'Close Sidebar' : 'Open Sidebar'}>
      <div className='relative'>
        <BaseButton
          color='transparent-hover'
          iconColor='icon-tertiary'
          onClick={toggleSidebar}
          label={isOpenSidebar ? 'Close Sidebar' : 'Open Sidebar'}
        >
          <SidebarIcon />
        </BaseButton>
      </div>
    </TooltipDefault>
  )
}
