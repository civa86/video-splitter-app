export const sexagesimalToSeconds = (hms: string): number => {
  const a = hms.split(':')
  return +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
}

export const secondsToSexagesimal = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsAsStr = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsAsStr
    .toString()
    .padStart(2, '0')}`
}

export const truncateInTheMiddle = (str: string, max: number): string => {
  const left = 2 * Math.ceil(max / 3)
  const right = max - left
  return str.length > max ? str.slice(0, left) + '...' + str.slice(-right) : str
}
