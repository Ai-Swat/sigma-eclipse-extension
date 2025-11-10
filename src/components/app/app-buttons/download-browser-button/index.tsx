import { useMemo } from 'react'
import BaseButton from 'src/components/ui/base-button'
import DownloadIcon from 'src/images/download-icon.svg?react'
import styles from './styles.module.css'

const MAC_DOWNLOAD_URL =
  'https://releases.sigmabrowser.com/mac-os/update/Sigma.dmg'

const DownloadBrowserButton = ({ isVisible }: { isVisible: boolean }) => {
  const isMacWithoutSigma = useMemo(() => {
    const platform = navigator.userAgent.toLowerCase()
    return platform.includes('mac') && !window.__SIGMA__
  }, [])

  if (!isMacWithoutSigma || !isVisible) return null

  return (
    <a href={MAC_DOWNLOAD_URL} download className='relative hide-mobile'>
      <BaseButton color='black' size='default' className={styles.button}>
        <BaseButton.Icon>
          <DownloadIcon width={18} height={18} className={styles.icon} />
        </BaseButton.Icon>
        Download browser
      </BaseButton>
    </a>
  )
}

export default DownloadBrowserButton
