import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { FollowUpType } from 'src/store/types'
import { encodeWithSpecialCharacters } from 'src/libs/utils'
import { DropdownItemType } from 'src/components/ui/dropdown'

export function useSearchHandler() {
  const { clearAllFollowUps, addFirstQuery, startSearch } = useSearchStore(
    useShallow((state) => ({
      clearAllFollowUps: state.clearAllFollowUps,
      addFirstQuery: state.addFirstQuery,
      startSearch: state.startSearch,
    }))
  )
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const runSearch = useCallback(
    async ({
      query,
      type,
      uploadedFiles,
      fileIds,
      navigateTo = false,
    }: {
      query: string
      type?: FollowUpType
      uploadedFiles?: any
      fileIds?: string[]
      navigateTo?: boolean | string
    }) => {
      clearAllFollowUps()

      if (navigateTo) {
        const q = encodeWithSpecialCharacters(query.trim())
        const path =
          typeof navigateTo === 'string' ? navigateTo : `/search?q=${q}`
        navigate(path)
      }

      addFirstQuery(query.trim(), uploadedFiles)

      await startSearch(
        query.trim(),
        searchParams,
        type,
        fileIds?.length ? fileIds : undefined
      )
    },
    [navigate, clearAllFollowUps, addFirstQuery, startSearch, searchParams]
  )

  const handleSearchMainPage = useCallback(
    async ({
      value,
      uploadedFiles,
      isUploadingFiles,
      activeSearchType,
      setUploadedFiles,
      idsUploadedFiles,
    }: {
      value: string
      uploadedFiles: any[]
      isUploadingFiles: boolean
      activeSearchType?: DropdownItemType
      setUploadedFiles: (v: any[]) => void
      idsUploadedFiles: string[]
    }) => {
      const fileIds = idsUploadedFiles?.length
        ? idsUploadedFiles
        : uploadedFiles
            ?.filter((el) => el.file_id)
            ?.map((el) => el.file_id as string)

      if (!value.trim().length || isUploadingFiles) return

      const queryType =
        activeSearchType?.value === FollowUpType.AUTO ||
        activeSearchType?.value === FollowUpType.CHAT_EXTENSION
          ? undefined
          : activeSearchType?.value

      await runSearch({
        query: value,
        type: queryType,
        uploadedFiles,
        fileIds,
        navigateTo: true,
      })

      setUploadedFiles([])
    },
    [runSearch]
  )

  return { runSearch, handleSearchMainPage }
}
