import { memo, useMemo } from 'react'
import { User } from 'src/store/types'
import { useClipboard } from 'src/libs/use/use-clipboard'
import BaseButton from 'src/components/ui/base-button'
import CheckIcon from 'src/images/check-icon.svg?react'
import CopyTextIcon from 'src/images/copy-search.svg?react'
import ProfileImage from '../../images/profile.png'

import styles from './styles.module.css'

export const UserInfo = memo(({ user }: { user?: User | null }) => {
  const userPicture = useMemo(() => user?.picture || ProfileImage, [user])
  const [copy, isCopied] = useClipboard()

  if (!user) return null

  return (
    <div className={styles.nameRow}>
      <img
        alt='Profile Image'
        className={styles.imageNameRow}
        src={userPicture}
        draggable={false}
      />
      <div className={styles.column}>
        <div className={styles.name}>{user?.username}</div>
        <div className={styles.email}>{user?.email}</div>
        <BaseButton
          color='transparent-hover'
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            copy(user?.email)
          }}
          className={styles.buttonCopy}
        >
          {isCopied ? (
            <CheckIcon className={styles.iconCopy} />
          ) : (
            <CopyTextIcon className={styles.iconCopy} />
          )}
        </BaseButton>
      </div>
    </div>
  )
})
