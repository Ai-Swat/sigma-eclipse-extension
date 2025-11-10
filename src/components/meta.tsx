import { useShallow } from 'zustand/react/shallow'
import { Helmet } from 'react-helmet'

import { useSearchStore } from '../store'
import { TypeFollowUp } from '../store/types'
import { formatTitleForSearch } from '../libs/use/use-title'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from 'src/config'

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getPictureUrl(followUp: TypeFollowUp) {
  if (!followUp.pictures || Array.isArray(!followUp.pictures)) {
    return 'https://'
  }

  const picture = followUp.pictures[0] || followUp?.generated_images?.at(-1)

  if (!picture || !picture.original) {
    return 'https://'
  }

  return picture.original
}

function getPicUrl(followUp: TypeFollowUp) {
  let url = ''
  const { query } = followUp
  let fixedQuery = query?.replace(/\n/g, '').trim()
  fixedQuery = fixedQuery
    ?.replace(/\[.*]/g, '')
    .replace(/\(.*\)/g, '')
    .replace(/\//g, '')
    .slice(0, 57)
  // let fixedQuery = query?.replace(/\n/g, '').trim().slice(0, 47)
  if (fixedQuery.length === 57) {
    fixedQuery += '...'
  }
  url = `https://ondemand.bannerbear.com/simpleurl/mE57Ye8RMr0B1pyVb9/image/hj32e7dsaihwd8asdh/text/${encodeURIComponent(
    capitalizeFirstLetter(fixedQuery)
  )}/sadahjsbx7821/image_url/`
  url = url + encodeURIComponent(getPictureUrl(followUp)) + '?v=2'
  return url
}

export function Meta() {
  const { followUps } = useSearchStore(
    useShallow((state) => ({
      followUps: state ? state.followUps : [],
    }))
  )

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <>
      {Array.isArray(followUps) && followUps[0] && (
        <Helmet>
          <meta
            property='og:title'
            content={capitalizeFirstLetter(followUps[0].query || '')}
          />
          <meta property='og:type' content='website' />
          <meta
            property='og:url'
            content={`https://app.sigmabrowser.com/chat/?search?id=${followUps[0].thread_id}`}
          />
          <meta
            property='og:image'
            content={getPicUrl(followUps[0] as TypeFollowUp)}
          />
          <meta
            property='og:logo'
            content='https://dmwtgq8yidg0m.cloudfront.net/images/sigmalogo.png'
          />
          <meta property='og:site_name' content='Sigma Search' />
          <meta
            property='og:updated_time'
            content={String(Math.floor(Date.now() / 1000))}
          />
          <meta name='twitter:card' content='summary_large_image' />
          <meta
            name='twitter:image'
            content={getPicUrl(followUps[0] as TypeFollowUp)}
          />
          <meta name='twitter:site' content='@Sigma_Browser' />
          <meta
            name='twitter:title'
            content={capitalizeFirstLetter(followUps[0].query || '')}
          />
          <meta
            name='description'
            content={followUps[0]?.summary?.slice(0, 120)}
          />
          <meta name='robots' content='noindex' />
        </Helmet>
      )}
    </>
  )
}

// Dirty hack to handle Helmet in SSR
export function createMetaSSR(followUp: TypeFollowUp, thread_name?: string) {
  if (!followUp) {
    return ''
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const head = `
      <title>${formatTitleForSearch(thread_name || followUp.query)}</title>
      <meta data-react-helmet="true" property="og:title" content="${capitalizeFirstLetter(thread_name || followUp.query || '')}" />
      <meta data-react-helmet="true" property="og:type" content="article" />
      <meta data-react-helmet="true" property="og:url"
          content="https://app.sigmabrowser.com/chat" />
      <meta data-react-helmet="true" property="og:image"
          content="${getPicUrl(followUp)}" />
      <meta data-react-helmet="true" property="og:logo" content="https://dmwtgq8yidg0m.cloudfront.net/images/sigmalogo.png" />
      <meta data-react-helmet="true" property="og:site_name" content="Sigma Search" />
      <meta data-react-helmet="true" name="twitter:card" content="summary_large_image" />
      <meta data-react-helmet="true" name="twitter:image"
          content="${getPicUrl(followUp)}" />
      <meta data-react-helmet="true" name="_foundr" content="d815f42b28590b49f1033f8a531e143a"/>
      <meta data-react-helmet="true" name="twitter:site" content="@Sigma_Browser" />
      <meta data-react-helmet="true" property="og:updated_time" content="${Math.floor(Date.now() / 1000)}" />
      <meta data-react-helmet="true" name="twitter:title" content="${capitalizeFirstLetter(thread_name || followUp.query || '')}" />
      <meta
            name='description'
            content="${followUp.summary?.slice(0, 120)}..."
          />
      <meta name="robots" content="noindex" />
  `
  return head
}

export function createMetaSSRForRoot() {
  const head = `
      <title>${DEFAULT_TITLE}</title>
      <meta property="og:type" content="article" />
      <meta property="og:title" content="${DEFAULT_TITLE}" />
      <meta property="og:description" content="${DEFAULT_DESCRIPTION}" />
      <meta property="og:url" content="https://app.sigmabrowser.com/chat" />

      <meta property="og:image" content="https://dmwtgq8yidg0m.cloudfront.net/images/opengraph123.jpeg" />
      <meta property="og:image:type" content="image/jpeg" />

      <meta name="twitter:image" content="https://dmwtgq8yidg0m.cloudfront.net/images/opengraph123.jpeg" />
      <meta name="twitter:card" content="summary_large_image" />

      <meta property="og:logo" content="https://dmwtgq8yidg0m.cloudfront.net/images/sigmalogo.png" /> 
      <meta property="og:site_name" content="Sigma Search" />
      <meta property="og:locale" content="en_En" />
      <meta name="_foundr" content="d815f42b28590b49f1033f8a531e143a"/>

      <meta name='description' content="${DEFAULT_DESCRIPTION}"/>
  `
  return head
}
