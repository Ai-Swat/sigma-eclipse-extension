import { capitalize } from '../capitalize'

export function useSetTitle() {
  return (title: string) => {
    document.title = capitalize(title)
  }
}

export function setSearchTitle(title: string) {
  document.title = formatTitleForSearch(title)
}

export function formatTitleForSearch(title: string) {
  return capitalize(`${title} | Sigma`)
}
