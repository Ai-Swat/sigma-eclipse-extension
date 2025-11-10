import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { FollowUpType } from 'src/store/types'
import { encodeWithSpecialCharacters } from 'src/libs/utils'
import { useSearchParams } from 'react-router-dom'

type RewriteFollowUpArgs = {
  id?: string
  parent_id?: string
  query_type: FollowUpType
  text_generation_settings?: any
  image_generation_settings?: any
  was_panel_used?: boolean
}

export function useRewriteFollowUp() {
  const { rewriteFollowUp, searchHash } = useSearchStore(
    useShallow((state) => ({
      rewriteFollowUp: state.rewriteFollowUp,
      searchHash: state.searchHash,
    }))
  )
  const [searchParams] = useSearchParams()

  const callRewriteFollowUp = useCallback(
    async ({
      id,
      parent_id,
      query_type,
      text_generation_settings,
      image_generation_settings,
      was_panel_used,
    }: RewriteFollowUpArgs) => {
      if (!rewriteFollowUp || !id) return

      const threadId =
        searchHash ||
        encodeWithSpecialCharacters(searchParams?.get('id') as string)

      return await rewriteFollowUp({
        threadId,
        followupId: id,
        parent_id,
        query_type,
        text_generation_settings:
          query_type === FollowUpType.TEXT_GENERATOR
            ? text_generation_settings
            : undefined,
        image_generation_settings:
          query_type === FollowUpType.IMAGE
            ? image_generation_settings
            : undefined,
        was_panel_used,
      })
    },
    [rewriteFollowUp, searchHash, searchParams]
  )

  return { callRewriteFollowUp }
}
