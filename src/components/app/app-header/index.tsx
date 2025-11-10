import { useLocation } from 'react-router-dom'
import loadable from '@loadable/component'
import { useSettingsStore } from 'src/store/settings'
import { Header } from 'src/components/app/app-header/components/header'
import { Hydrated } from 'src/components/containers/hydrated'
import { useHandleSearchRouteChange } from 'src/libs/use/use-handle-search-route-change'

const HeaderExtension = loadable(
  () => import('src/components/app/app-header/components/header-extension')
)

export function AppHeader() {
  const isExtension = useSettingsStore((state) => state.isExtension)
  const location = useLocation()
  const isAuth = location.pathname === '/auth'
  const isLegalPages =
    location.pathname === '/privacypolicy' ||
    location.pathname === '/terms-of-service'

  // Хук обрабатывает изменения в URL (?q= или ?id=) и запускает поиск или загрузку фоллоуапа
  // Hook handles changes in the URL (?q= or ?id=) and triggers a search or loads a follow-up
  useHandleSearchRouteChange()

  return (
    <Hydrated fallbackHeight={56}>
      {!isAuth &&
        !isLegalPages &&
        (isExtension ? <HeaderExtension /> : <Header />)}
    </Hydrated>
  )
}
