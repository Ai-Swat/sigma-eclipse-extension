import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import { FollowUpType, TariffCode } from 'src/store/types'
import { useGenerationCounterStore } from 'src/store/generation-counter'
import loadable from '@loadable/component'

const UnlockFullPowerPopup = loadable(
  () => import('../unlock-full-power-popup')
)
const SignUpPopup = loadable(() => import('../sign-up-popup'))
const FullSignUpPopup = loadable(() => import('../full-sign-up-popup'))
const RequestsLimitReachedPopup = loadable(
  () => import('../requests-limit-reached-popup')
)
const UnlockImageGenerationPopup = loadable(
  () => import('../unlock-image-generation-popup')
)
const FullUnlockImageGenerationPopup = loadable(
  () => import('../full-unlock-image-generation-popup')
)
const UpgradePlanLimitedPopup = loadable(
  () => import('../upgrade-plan-limited-popup')
)
const LimitImageGenerationPopup = loadable(
  () => import('../limit-image-generation-popup')
)

const STORAGE_KEYS = {
  FIRST_POPUP: 'FIRST_POPUP_SHOWN',
  SECOND_POPUP: 'SECOND_POPUP_SHOWN',
  THIRD_POPUP: 'THIRD_POPUP_SHOWN',
  FIRST_IMAGE: 'FIRST_IMAGE_POPUP_SHOWN',
} as const

export const POPUP_IDS = {
  FIRST: 'FIRST_POPUP_ID',
  SECOND: 'SECOND_POPUP_ID',
  THIRD: 'THIRD_POPUP_ID',
  LIMIT_EXCEEDED_IMAGE: 'LIMIT_EXCEEDED_IMAGE_POPUP_ID',
  FIRST_IMAGE: 'FIRST_IMAGE_POPUP_ID',
  SECOND_IMAGE: 'SECOND_IMAGE_POPUP_ID',
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED_POPUP_ID',
  UPGRADE_PLAN: 'UPGRADE_PLAN_POPUP_ID',
} as const

type PopupId = keyof typeof POPUP_IDS

const wasShown = (key: string) =>
  typeof window !== 'undefined' && sessionStorage.getItem(key) === 'true'

const markShown = (key: string) =>
  typeof window !== 'undefined' && sessionStorage.setItem(key, 'true')

export function AuthPopupsContainer({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [openPopups, setOpenPopups] = useState<Set<PopupId>>(new Set())
  const lastProcessedFollowUpId = useRef<string | number | null>(null)

  const {
    is_log_in,
    user,
    is_limit_exceeded,
    limit_exceeded_type,
    limit_counter,
    limit_counter_type,
    followUps,
  } = useSearchStore(
    useShallow((state) => ({
      followUps: state.followUps,
      is_log_in: state.is_log_in,
      user: state.user,
      is_limit_exceeded: state.is_limit_exceeded,
      limit_exceeded_type: state.limit_exceeded_type,
      limit_counter_type: state.limit_counter_type,
      limit_counter: state.limit_counter,
    }))
  )

  const generation_counter = useGenerationCounterStore(
    (state) => state.generation_counter
  )

  const lastFollowUpType = followUps.at(-1)?.followup_type
  const lastFollowUpId = followUps.at(-1)?.created_at

  const isLogIn = Boolean(is_log_in && user)
  const isFreePlan = user?.subscription?.plan_name === TariffCode.FREE
  const isEveryPopupClosed = openPopups.size === 0

  const prevLimitCounter = useRef<number>(0)

  const openPopup = useCallback((id: PopupId) => {
    setOpenPopups((prev) => new Set(prev).add(id))
  }, [])

  const closePopup = useCallback((id: PopupId) => {
    setOpenPopups((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  useEffect(() => {
    if (!isClient) return
    if (!sessionStorage || !isEveryPopupClosed) return
    if (!lastFollowUpId) return

    // если мы уже обработали этот followUpId — ничего не делаем
    if (lastProcessedFollowUpId.current === lastFollowUpId) {
      return
    }

    const rules: {
      id: PopupId
      condition: () => boolean
      storageKey?: keyof typeof STORAGE_KEYS
    }[] = [
      {
        id: 'LIMIT_EXCEEDED',
        condition: () =>
          Boolean(
            is_limit_exceeded &&
              isLogIn &&
              limit_exceeded_type === lastFollowUpType &&
              limit_exceeded_type !== FollowUpType.IMAGE
          ),
      },
      {
        id: 'LIMIT_EXCEEDED_IMAGE',
        condition: () =>
          Boolean(
            is_limit_exceeded &&
              isLogIn &&
              limit_exceeded_type === lastFollowUpType &&
              limit_exceeded_type === FollowUpType.IMAGE
          ),
      },
      {
        id: 'UPGRADE_PLAN',
        condition: () => {
          const shouldShow = Boolean(
            !is_limit_exceeded &&
              isLogIn &&
              isFreePlan &&
              limit_counter &&
              limit_counter_type !== 'image-generation' &&
              prevLimitCounter.current !== limit_counter &&
              isLimitCounterReached(limit_counter)
          )

          if (shouldShow && limit_counter) {
            prevLimitCounter.current = limit_counter
          }

          return shouldShow
        },
      },
      {
        id: 'FIRST_IMAGE',
        condition: () =>
          Boolean(
            is_limit_exceeded &&
              limit_exceeded_type === FollowUpType.IMAGE &&
              !isLogIn
          ),
        storageKey: 'FIRST_IMAGE',
      },
      {
        id: 'SECOND_IMAGE',
        condition: () =>
          Boolean(
            is_limit_exceeded &&
              limit_exceeded_type === FollowUpType.IMAGE &&
              !isLogIn
          ),
      },
      {
        id: 'THIRD',
        condition: () => Boolean(is_limit_exceeded && !isLogIn),
      },
      {
        id: 'FIRST',
        condition: () => Number(generation_counter) === 2 && !isLogIn,
        storageKey: 'FIRST_POPUP',
      },
      {
        id: 'SECOND',
        condition: () => Number(generation_counter) === 5 && !isLogIn,
        storageKey: 'SECOND_POPUP',
      },
      {
        id: 'THIRD',
        condition: () => Number(generation_counter) >= 8 && !isLogIn,
        storageKey: 'THIRD_POPUP',
      },
    ]

    for (const rule of rules) {
      if (rule.condition()) {
        if (rule.storageKey && wasShown(STORAGE_KEYS[rule.storageKey])) continue

        if (rule.storageKey) markShown(STORAGE_KEYS[rule.storageKey])
        openPopup(rule.id)

        lastProcessedFollowUpId.current = lastFollowUpId // помечаем этот followUpId как обработанный
        break
      }
    }
  }, [
    isClient,
    is_limit_exceeded,
    limit_exceeded_type,
    generation_counter,
    isLogIn,
    isFreePlan,
    limit_counter,
    limit_counter_type,
    lastFollowUpType,
    isEveryPopupClosed,
    openPopup,
    lastFollowUpId,
  ])

  const isWidget = useSettingsStore((state) => state.isWidget)
  const isExtension = useSettingsStore((state) => state.isExtension)

  const isLimitCounterReached = useCallback(
    (limit_counter: number) => {
      const desktopLimits = [10, 20, 40]
      const extensionLimits = [5, 10, 30]

      return !isExtension
        ? desktopLimits.includes(limit_counter)
        : extensionLimits.includes(limit_counter)
    },
    [isExtension]
  )

  if (isWidget) return <>{children}</>

  const popupComponents: {
    id: PopupId
    Component: any
    skipInExtension?: boolean
  }[] = [
    { id: 'FIRST', Component: UnlockFullPowerPopup, skipInExtension: true },
    { id: 'SECOND', Component: SignUpPopup, skipInExtension: true },
    { id: 'THIRD', Component: FullSignUpPopup, skipInExtension: true },
    {
      id: 'SECOND_IMAGE',
      Component: FullUnlockImageGenerationPopup,
      skipInExtension: true,
    },
    { id: 'LIMIT_EXCEEDED', Component: RequestsLimitReachedPopup },
    { id: 'LIMIT_EXCEEDED_IMAGE', Component: LimitImageGenerationPopup },
    {
      id: 'FIRST_IMAGE',
      Component: UnlockImageGenerationPopup,
      skipInExtension: true,
    },
    { id: 'UPGRADE_PLAN', Component: UpgradePlanLimitedPopup },
  ]

  return (
    <>
      {children}

      {isClient &&
        popupComponents.map(({ id, Component, skipInExtension }) => {
          if (skipInExtension && isExtension) return null
          return (
            <Component
              key={id}
              visible={openPopups.has(id)}
              onClose={() => closePopup(id)}
            />
          )
        })}
    </>
  )
}
