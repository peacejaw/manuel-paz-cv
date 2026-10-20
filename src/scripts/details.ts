import { cvEs as cv } from '@/i18n'
import PhotoSwipe from 'photoswipe'

const $$ = <T extends Element = HTMLElement>(selector: string) => Array.from(document.querySelectorAll<T>(selector))
const openedAt = new Map<HTMLDialogElement, number>()
let openOrder = 0
let viewer: PhotoSwipe | undefined

function openExperience(dialog: HTMLDialogElement) {
  if (dialog.open) return
  openedAt.set(dialog, ++openOrder)
  dialog.showModal()
  dialog.scrollTop = 0
}

$$<HTMLButtonElement>('[data-case]').forEach(button => button.addEventListener('click', () => {
  const dialog = document.getElementById(`case-${button.dataset.case}`) as HTMLDialogElement | null
  if (dialog) openExperience(dialog)
}))
$$<HTMLButtonElement>('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()))
$$<HTMLDialogElement>('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close()
  })
  dialog.addEventListener('close', () => dialog.querySelectorAll('video').forEach(video => video.pause()))
})

$$<HTMLAnchorElement>('[data-media]').forEach(link => link.addEventListener('click', event => {
  // Preserve normal links for new tabs and browsers without JavaScript.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  const media = cv.timeline.find(item => item.id === link.dataset.group)?.media
  if (!media?.length || viewer) return
  event.preventDefault()

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const pswp = new PhotoSwipe({
    dataSource: media.map(item => ({ src: item.src, width: item.width, height: item.height, alt: item.caption })),
    index: Number(link.dataset.index ?? 0),
    mainClass: 'cv-photo-viewer',
    bgOpacity: 1,
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 1,
    maxZoomLevel: 1,
    loop: false,
    preload: [0, 1],
    showHideAnimationType: 'fade',
    showAnimationDuration: reducedMotion ? 0 : 150,
    hideAnimationDuration: reducedMotion ? 0 : 150,
    zoomAnimationDuration: reducedMotion ? 0 : 180,
    returnFocus: false,
    clickToCloseNonZoomable: false,
    imageClickAction: 'zoom',
    tapAction: false,
    doubleTapAction: 'zoom',
    closeOnVerticalDrag: false,
    pinchToClose: false,
    closeTitle: 'Cerrar imagen',
    zoomTitle: 'Ampliar o ajustar imagen',
    arrowPrevTitle: 'Imagen anterior',
    arrowNextTitle: 'Imagen siguiente',
    errorMsg: 'No se pudo cargar la imagen. Puedes abrir la original con el enlace inferior.',
    paddingFn: viewport => ({
      top: 76,
      bottom: viewport.x < 600 && viewport.y >= 500 ? 176 : 144,
      left: viewport.x < 600 ? 12 : 76,
      right: viewport.x < 600 ? 12 : 76
    })
  })
  viewer = pswp
  let suspended: Array<{ dialog: HTMLDialogElement; scrollTop: number }> = []

  pswp.on('beforeOpen', () => {
    document.body.classList.add('photo-viewer-open')
    suspended = $$<HTMLDialogElement>('dialog[open]')
      .sort((a, b) => (openedAt.get(a) ?? 0) - (openedAt.get(b) ?? 0))
      .map(dialog => ({ dialog, scrollTop: dialog.scrollTop }))
    // Native dialogs occupy the top layer; suspend them while the photo viewer is active.
    for (const { dialog } of [...suspended].reverse()) dialog.close()
  })

  pswp.on('uiRegister', () => {
    pswp.element?.setAttribute('aria-modal', 'true')
    pswp.element?.setAttribute('aria-label', 'Galería de fotografías')
    pswp.ui?.registerElement({
      name: 'photo-caption',
      appendTo: 'root',
      isButton: false,
      onInit: element => {
        element.setAttribute('aria-live', 'polite')
        const caption = document.createElement('p')
        const date = document.createElement('p')
        date.className = 'photo-date'
        const original = document.createElement('a')
        original.textContent = 'Abrir imagen original'
        original.target = '_blank'
        original.rel = 'noopener noreferrer'
        element.append(caption, date, original)
        const updateCaption = () => {
          const item = media[pswp.currIndex]
          if (!item) return
          caption.textContent = item.caption
          date.textContent = item.date
          date.hidden = !item.date
          original.href = item.src
        }
        pswp.on('change', updateCaption)
        updateCaption()
      }
    })
  })

  pswp.on('destroy', () => {
    viewer = undefined
    // Restore the reading position after PhotoSwipe removes its focus trap.
    queueMicrotask(() => {
      for (const { dialog, scrollTop } of suspended) {
        if (!dialog.isConnected) continue
        dialog.showModal()
        dialog.scrollTop = scrollTop
      }
      document.body.classList.remove('photo-viewer-open')
      link.focus({ preventScroll: true })
    })
  })
  pswp.init()
}))

$$('[data-print]').forEach(button => button.addEventListener('click', () => window.print()))

// Previously shared anchors open the matching detail from the CV.
const aliases: Record<string, string> = { perfil: 'universidad' }
function openHash() {
  const hash = decodeURIComponent(location.hash.slice(1))
  const id = hash.startsWith('hito-') ? hash.slice(5) : aliases[hash]
  if (!id) return
  const dialog = document.getElementById(`case-${id}`) as HTMLDialogElement | null
  if (dialog) openExperience(dialog)
}
openHash()
window.addEventListener('hashchange', openHash)
