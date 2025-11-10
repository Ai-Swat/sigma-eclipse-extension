let scrollTop: number

export const lockScroll = () => {
  scrollTop = window.scrollY
  document.body.style.overflowY = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollTop}px`
  document.body.style.width = '100%'
}

export const unlockScroll = () => {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflowY = 'auto'
  window.scrollTo(0, scrollTop)
}
