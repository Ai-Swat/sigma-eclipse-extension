import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const LINK_WITH_UTM_TAGS = 'LINK_WITH_UTM_TAGS'

export const saveLinkWithUtmTags = (link: string) => {
  if (!hasOpenedLinkUtmTags()) localStorage?.setItem(LINK_WITH_UTM_TAGS, link)
}

export const removeLinkWithUtmTags = () => {
  localStorage?.removeItem(LINK_WITH_UTM_TAGS)
}

export const hasOpenedLinkUtmTags = () => {
  return !!localStorage?.getItem(LINK_WITH_UTM_TAGS)
}

export const openedLinkWithUtmTags = () => {
  return localStorage?.getItem(LINK_WITH_UTM_TAGS)
}

export const useUtmTags = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.search.includes('utm')) {
      saveLinkWithUtmTags(location.search)
    }
  }, [])
}
