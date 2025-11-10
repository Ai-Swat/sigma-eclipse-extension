import { PropsWithChildren, useEffect } from 'react'
import { useFileContext } from 'src/contexts/fileContext'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

export const DragNDropWrapper = ({ children }: PropsWithChildren) => {
  const { setIsDragging, processAndLimitFiles } = useFileContext()

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: File[] }) {
        const files = item.files
        if (!files) return
        processAndLimitFiles(files)
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }
      },
    }),
    [processAndLimitFiles]
  )

  const isActive = canDrop && isOver

  useEffect(() => {
    setIsDragging(isActive)
  }, [isActive])

  return (
    <div style={{ width: '100%', height: '100%' }} ref={drop}>
      {children}
    </div>
  )
}
