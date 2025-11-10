import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useFileContext } from 'src/contexts/fileContext'
import { useThemeContext } from 'src/contexts/themeContext'
import FileContainerImage from 'src/images/file-container.svg?url'
import FileContainerImageDark from 'src/images/file-container-dark.svg?url'

import css from './styles.module.css'

export const DragNDropForm = () => {
  const { isDragging } = useFileContext()

  const [openedFromDragging, setOpenedFromDragging] = useState(false)

  useEffect(() => {
    if (isDragging) {
      setOpenedFromDragging(true)
      return
    }
    if (!isDragging && openedFromDragging) {
      setOpenedFromDragging(false)
    }
  }, [isDragging])

  const isShowForm = openedFromDragging

  return (
    <>
      <div
        className={clsx(css.root, {
          [css.overlay]: isShowForm,
        })}
      >
        {isShowForm && <DraggableFileInput />}
      </div>
    </>
  )
}

const DraggableFileInput = () => {
  const { theme } = useThemeContext()
  const isDark = theme === 'dark'

  return (
    <div className={css.container}>
      <img
        src={isDark ? FileContainerImageDark : FileContainerImage}
        alt=''
        className={css.image}
        draggable={false}
      />

      <div className={css.textBlock}>
        <span>Drop anything here</span>
        <span>Add any file here to add it to the conversation</span>
      </div>
    </div>
  )
}
