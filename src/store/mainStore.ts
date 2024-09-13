import { defineStore } from 'pinia'
import { AppError, AppStatus, MainStoreState, VideoInfo } from '../types'
import { truncateInTheMiddle } from '../utils/utilsGeneric'

declare const backend: typeof import('../preload').backend

const VIDEO_VOID = {
  name: '',
  sexagesimal: '',
  seconds: -1,
  path: '',
  inputPath: ''
}

export const useStore = defineStore('main', {
  state: (): MainStoreState => ({
    appStatus: AppStatus.INPUT,
    video: VIDEO_VOID,
    outputPath: '',
    parts: 2,
    isSplitting: false,
    isFetching: false,
    error: null
  }),
  getters: {
    videoName: state => truncateInTheMiddle(state.video.name, 40),
    videoOutputPath: state => `${truncateInTheMiddle(state.outputPath, 39)}/`
  },
  actions: {
    restart() {
      this.appStatus = AppStatus.INPUT
      this.video = VIDEO_VOID
      this.outputPath = ''
      this.parts = 2
      this.isFetching = false
      this.isSplitting = false
      this.error = null
    },
    async setOutputPath() {
      this.outputPath = await backend.prettyPath(this.video.path)
    },
    async setVideoElement(file: File) {
      try {
        this.error = null
        this.appStatus = AppStatus.SPLIT
        this.isFetching = true
        this.video.name = file.name

        const info: VideoInfo = await backend.getVideoInfo(file)
        this.video.sexagesimal = info.sexagesimal
        this.video.seconds = info.seconds
        this.video.path = info.path
        this.video.inputPath = info.inputPath
        this.setOutputPath()
      } catch (e) {
        this.error = AppError.GET_INFO
      } finally {
        this.isFetching = false
      }
    },
    async splitVideo() {
      try {
        if (this.isSplitting === false) {
          this.error = null
          this.isSplitting = true
          await backend.splitVideo({ ...this.video }, this.parts)
          this.appStatus = AppStatus.SUCCESS
        }
      } catch (e) {
        this.error = AppError.SPLIT
      } finally {
        if (this.isSplitting === true) {
          this.isSplitting = false
        }
      }
    },
    async selectOutput() {
      const result = await backend.selectFolder(this.video.path)
      if (result) {
        this.video.path = result
        this.setOutputPath()
      }
    }
  }
})
