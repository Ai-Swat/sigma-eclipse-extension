import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthProvider } from 'src/store/types'

interface UseHandleAuthCodeProps {
  signIn: (
    authCode: string,
    provider: AuthProvider,
    isProcessingRedirect?: boolean
  ) => Promise<void | { isRegistered: boolean }>
  isProcessingRedirect?: boolean
}

export function useHandleAuthCode({
  signIn,
  isProcessingRedirect,
}: UseHandleAuthCodeProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const authCode = searchParams.get('code')

  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  const handleOpenReferral = () => {
    navigate(`${path}#referral`)
  }

  useEffect(() => {
    if (!authCode) return

    let timeoutId: ReturnType<typeof setTimeout>

    const handleSignIn = async (code: string) => {
      const state = searchParams.get('state')
      const provider =
        state && state === 'apple-oauth-state'
          ? AuthProvider.APPLE
          : AuthProvider.GOOGLE

      await signIn(code, provider, isProcessingRedirect)

      timeoutId = setTimeout(() => {
        setSearchParams('')
        handleOpenReferral()
      }, 100)
    }

    void handleSignIn(authCode)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [authCode, signIn, setSearchParams, searchParams])
}
