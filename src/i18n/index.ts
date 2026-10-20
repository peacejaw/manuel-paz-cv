import rawCV from "@cv"

export const withBase = (path: string) => {
  if (!path.startsWith("/") || path.startsWith("//")) return path
  const base = import.meta.env.BASE_URL.replace(/\/$/, "")
  return base && (path === base || path.startsWith(`${base}/`))
    ? path
    : `${base}${path}`
}

export const cvEs = {
  ...rawCV,
  basics: { ...rawCV.basics, image: withBase(rawCV.basics.image) },
  timeline: rawCV.timeline.map(item => ({
    ...item,
    media: item.media.map(media => ({ ...media, src: withBase(media.src) })),
    videos: item.videos.map((video: { src: string; poster: string; caption: string }) => ({
      ...video, src: withBase(video.src), poster: withBase(video.poster)
    }))
  }))
}
import { ui } from "./ui"

// Añade aquí un idioma con su CV y sus textos en `ui.ts`.
// Si solo quieres un idioma, deja únicamente el de `DEFAULT_LANG`.
export const LANGUAGES = {
  es: { name: "Español", cv: cvEs },
}

export type Lang = keyof typeof LANGUAGES

export const DEFAULT_LANG: Lang = "es"

export const getCV = (lang: Lang) => LANGUAGES[lang].cv

export const getLangPath = (lang: Lang) =>
  withBase(lang === DEFAULT_LANG ? "/" : `/${lang}/`)

export const useTranslations = (lang: Lang) => {
  return (
    key: keyof (typeof ui)[typeof DEFAULT_LANG],
    params: Record<string, string> = {}
  ) =>
    ui[lang][key].replace(/\{(\w+)\}/g, (match, param) => params[param] ?? match)
}

export const formatMonthYear = (lang: Lang, date: string) =>
  new Intl.DateTimeFormat(lang, {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(date))
