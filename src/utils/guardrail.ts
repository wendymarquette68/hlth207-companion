import config from '../config/course.config.json'

export function isBlocked(text: string): boolean {
  const lower = text.toLowerCase()
  return config.blockedKeywords.some(kw => lower.includes(kw.toLowerCase()))
}
