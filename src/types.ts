export enum AppStatus {
  'INPUT',
  'SPLIT',
  'SUCCESS'
}

export enum AppError {
  'GET_INFO',
  'SPLIT'
}

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
}

export type MainStoreState = {
  appStatus: AppStatus
  video: VideoElement
  outputPath: string
  parts: number
  isFetching: boolean
  isSplitting: boolean
  error: null | AppError
}
