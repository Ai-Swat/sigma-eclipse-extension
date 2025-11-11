import { Toaster } from 'react-hot-toast'
import useMobileDetect from 'src/sidepanel/libs/use/use-mobile-detect'
import { Hydrated } from 'src/sidepanel/components/new-components/containers/hydrated'

export function AppToaster() {
  const isMobile = useMobileDetect()
  return (
    <Hydrated>
      <Toaster
        position={isMobile ? 'top-center' : 'top-right'}
        containerClassName={'toaster-container'}
      />
    </Hydrated>
  )
}
