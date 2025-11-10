export const TEXTAREA_ID_EXTENSION = 'TEXTAREA_ID_EXTENSION'
export const TEXTAREA_ID_DESKTOP = 'TEXTAREA_ID_DESKTOP'
export const TEXTAREA_ID_MOBILE = 'TEXTAREA_ID_MOBILE'
export const TEXTAREA_FOLLOWUP_ID = 'TEXTAREA_FOLLOWUP_ID'
export const TEXTAREA_FOLLOWUP_ID_MOBILE = 'TEXTAREA_FOLLOWUP_ID_MOBILE'

export interface Query {
  original: string
}

export type Option = {
  label: string
  value: string
  url?: string
}

export interface SuggestResp {
  type: string
  query: Query | string
  results: Result[]
}

export interface Result {
  query: string
}

export function prepareOptions(
  data:
    | SuggestResp
    | { query: string; type: string; results: { query: string }[] }
    | null
): Option[] {
  let items: Option[] = []

  if (!data) return []

  if ('results' in data) {
    items = data.results.map((res: Result) => ({
      label: res.query,
      value: res.query,
    }))
  }

  return items
}

const OPTIONS_AMOUNT = 15

function getRandomItems<T>(items: T[], count: number): T[] {
  // Shuffle the array
  const shuffled = items.sort(() => 0.5 - Math.random())

  return shuffled.slice(0, count)
}

export function getSliceOfRandomOptions(options: Option[]) {
  if (options.length <= OPTIONS_AMOUNT) {
    return options
  }

  return getRandomItems(options, OPTIONS_AMOUNT)
}

export async function fetchSuggestions(
  query: string,
  controller?: AbortController
) {
  try {
    if (!query || !query.trim()) {
      return null
    }

    const URL = '/front-api/suggestions'

    const params: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query,
        lang: navigator.language || 'en',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller?.signal,
    }

    const response = await fetch(URL, params)
    const data: SuggestResp = await response.json()
    return data
  } catch (ignore) {
    return null
  }
}
