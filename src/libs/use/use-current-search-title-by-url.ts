// vendor
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export default function useCurrentSearchTitleByUrl() {
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const searchTitle = searchParams.get('id')

  const title = useMemo(
    () =>
      searchTitle
        ? searchTitle.substring(0, searchTitle.lastIndexOf('-')).trim()
        : void 0,
    [searchTitle]
  )

  return title
}
