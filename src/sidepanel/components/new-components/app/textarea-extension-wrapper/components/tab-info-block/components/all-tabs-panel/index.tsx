import { memo } from 'react'
import { clsx } from 'clsx'
import { PageHTMLData } from 'src/store/slices/html-context-slice'
import { CheckBox } from 'src/components/ui/checkbox'
import { TooltipDefault } from 'src/components/ui/tooltip'
import { TabInfoRow } from '../tab-info-row'
import ClearIcon from 'src/images/clear-icon.svg?react'
import IconCheck from 'src/images/check-icon.svg?react'
import styles from './styles.module.css'

interface Props {
  onClose: () => void
  pageData?: PageHTMLData[]
  handleToggleContext: (
    tab_id?: number,
    isSelected?: boolean,
    isAddedToContext?: boolean
  ) => void
}

const MAX_SOURCES = 5

const AllTabsPanelContentComponent = ({
  onClose,
  pageData,
  handleToggleContext,
}: Props) => {
  const sources = pageData
  const isSourcesOverflow = sources && sources?.length > MAX_SOURCES

  return (
    <div className='relative fade-in w-100p'>
      <div className={styles.container}>
        <div className={styles.header}>
          Add to Context
          <ClearIcon
            onClick={onClose}
            width={18}
            height={18}
            className={styles.icon}
          />
        </div>
        <div
          className={clsx(styles.list, {
            [styles.longList]: isSourcesOverflow,
          })}
        >
          {sources?.map((source) => (
            <div
              key={source.tab_id}
              className={styles.item}
              onClick={() =>
                handleToggleContext(
                  source.tab_id,
                  source?.isSelected,
                  source?.isAddedToContext
                )
              }
            >
              <TabInfoRow favicon={source.favicon} title={source.title} />

              {source.isAddedToContext ? (
                <TooltipDefault text='Already in context'>
                  <div className='relative'>
                    <IconCheck
                      width={20}
                      height={20}
                      className={styles.iconCheck}
                    />
                  </div>
                </TooltipDefault>
              ) : (
                <CheckBox
                  checked={source.isSelected}
                  onChange={(value) =>
                    handleToggleContext(
                      source.tab_id,
                      value,
                      source?.isAddedToContext
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {isSourcesOverflow && <div className={styles.gradientFooter} />}
    </div>
  )
}

export const AllTabsPanelContent = memo(AllTabsPanelContentComponent)
