export function mergeUniqueByUrl<T extends { url: string }>(
  primary: T[], // htmlPayloads
  secondary: T[] // pageDataRaw или selectedPageDataRaw
): T[] {
  const seen = new Set<string>()

  // Сначала добавляем все из primary (htmlPayloads)
  const result: T[] = []
  for (const item of primary) {
    if (!seen.has(item.url)) {
      seen.add(item.url)
      result.push(item)
    }
  }

  // Потом добавляем только уникальные из secondary
  for (const item of secondary) {
    if (!seen.has(item.url)) {
      seen.add(item.url)
      result.push(item)
    }
  }

  return result
}
