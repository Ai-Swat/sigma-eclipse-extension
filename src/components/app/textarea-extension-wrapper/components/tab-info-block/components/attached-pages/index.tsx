import { memo } from 'react'
import cn from 'clsx'
import { PageHTMLData } from 'src/store/slices/html-context-slice'
import styles from './styles.module.css'

const MAX_ICONS = 4

const AttachedPagesComponent = ({
  selectedPageData,
  className,
}: {
  selectedPageData: PageHTMLData[]
  className?: string
}) => {
  const displayedPages = selectedPageData?.slice(0, MAX_ICONS)

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.icons}>
        {displayedPages?.map(({ favicon, tab_id, title, id }, index) => (
          <img
            key={tab_id || id}
            src={favicon}
            alt={`icon-${title}`}
            className={styles.icon}
            style={{ zIndex: displayedPages?.length - index }}
          />
        ))}
      </div>
      <span className={styles.text}>
        {selectedPageData?.length} Pages Attached
      </span>
    </div>
  )
}

export const AttachedPages = memo(AttachedPagesComponent)
