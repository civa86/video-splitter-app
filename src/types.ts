export type VideoInfo = {
  path: string
  inputPath: string
  sexagesimal: string
  seconds: number
}

export type VideoElement = {
  name: string
  sexagesimal: string
  seconds: number
  path: string
  inputPath: string
  prettyPath: string
}

export enum AppStatus {
  'INPUT',
  'SPLIT',
  'SUCCESS',
  'ERROR'
}
