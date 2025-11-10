import { clsx } from 'clsx'
import { FC } from 'react'
import css from './styles.module.css'

interface Props {
  text: string
  searchValue: string
  className?: string
}

const SuggestionOptionHighlight: FC<Props> = ({
  text,
  searchValue,
  className,
}) => {
  const cn = clsx(css.root, className)

  if (!searchValue.trim()) {
    return <span className={cn}>{text}</span>
  }

  const index = text.toLowerCase().indexOf(searchValue.toLowerCase())

  if (index === -1) {
    return <span className={cn}>{text}</span>
  }

  const before = text.slice(0, index)
  const match = text.slice(index, index + searchValue.length)
  const after = text.slice(index + searchValue.length)

  return (
    <span className={cn}>
      {before}
      <span className={css.matchedPart}>{match}</span>
      {after}
    </span>
  )
}

export default SuggestionOptionHighlight
