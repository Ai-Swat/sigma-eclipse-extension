import { Link } from 'react-router-dom'
import { useSettingsStore } from 'src/store/settings'
import { Hydrated } from 'src/components/containers/hydrated'
import css from './styles.module.css'
import { useShallow } from 'zustand/react/shallow'

export function FooterLinks() {
  const { isWidget, isExtension } = useSettingsStore(
    useShallow((state) => ({
      isWidget: state.isWidget,
      isExtension: state.isExtension,
    }))
  )
  const isNotWidgetOrExtension = !isWidget && !isExtension

  return (
    <div className={css.wrapperFooter}>
      <Hydrated fallbackHeight={68}>
        {isNotWidgetOrExtension && (
          <div className={css.footer}>
            <div>
              <Link to='/privacypolicy'>Privacy Policy</Link>
            </div>
            {/*<div>*/}
            {/*  <a href='https://sigmabrowser.com/'>Sigma Browser</a>*/}
            {/*</div>*/}
            <div>
              <Link to='/terms-of-service'>Terms of Service</Link>
            </div>
          </div>
        )}

        <div className={css.companyLabel}>Sigmabrowser OÜ</div>
      </Hydrated>
    </div>
  )
}
