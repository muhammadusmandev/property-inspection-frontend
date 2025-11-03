export default function dateTimeToDateISO(datetime) {
  const pad = (n) => (n < 10 ? '0' + n : n)
  const year = datetime.getFullYear()
  const month = pad(datetime.getMonth() + 1)
  const day = pad(datetime.getDate())
  return `${year}-${month}-${day}`
}

export function localeAwareLongDateFormat(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}