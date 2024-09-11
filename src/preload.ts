// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, webUtils, ipcRenderer } from 'electron'
import { VideoElement, VideoInfo } from './types'

export const backend = {
  prettyPath: (path: string) => ipcRenderer.invoke('string:pretty:path', path),
  getVideoInfo: async (video: File): Promise<VideoInfo> => {
    const path = webUtils.getPathForFile(video)
    const result = await ipcRenderer.invoke('video:get:info', path)
    return result
  },
  selectFolder: async (defaultPath: string): Promise<string> => {
    const result = await ipcRenderer.invoke('dialog:get:directory', defaultPath)
    return result
  },
  splitVideo: async (video: VideoElement, parts: number): Promise<boolean> => {
    const result = await ipcRenderer.invoke('video:split', { video, parts })
    return result
  }
}

contextBridge.exposeInMainWorld('backend', backend)
