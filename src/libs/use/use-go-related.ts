import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { FollowUpType } from 'src/store/types'
import { encodeWithSpecialCharacters } from 'src/libs/utils'

type GoRelatedArgs = {
  query: string
  parent_id?: string
  followup_type: FollowUpType
  file_ids?: string[]
  files?: any[]
  text_generation_settings?: any
  image_generation_settings?: any
  was_panel_used?: boolean
}

export function useGoRelated(defaultThreadId?: string) {
  const { searchHash, goRelated } = useSearchStore(
    useShallow((state) => ({
      searchHash: state.searchHash,
      goRelated: state.goRelated,
    }))
  )
  const [searchParams] = useSearchParams()

  const callGoRelated = useCallback(
    async ({
      query,
      parent_id,
      followup_type,
      file_ids,
      files,
      text_generation_settings,
      image_generation_settings,
      was_panel_used,
    }: GoRelatedArgs) => {
      if (!goRelated || !parent_id) return

      const threadId =
        searchHash ||
        encodeWithSpecialCharacters(searchParams?.get('id') as string)

      return goRelated({
        query: query?.trim() || '',
        threadId,
        parent_id,
        followup_type,
        file_ids,
        files,
        text_generation_settings,
        image_generation_settings,
        was_panel_used,
      })
    },
    [goRelated, searchHash, searchParams, defaultThreadId]
  )

  return { callGoRelated }
}
