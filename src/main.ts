import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent, dialog } from 'electron'
import path from 'path'
import os from 'os'
import { runProcess, ffmpegPath, ffprobePath, prettyPath } from './utils/utilsNode'
import { VideoElement, VideoInfo } from './types'
import { secondsToSexagesimal, sexagesimalToSeconds } from './utils/utilsGeneric'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: app.isPackaged ? false : true
    }
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'detach' })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle(
  'string:pretty:path',
  async (event: IpcMainInvokeEvent, filePath: string): Promise<string> => prettyPath(filePath)
)

ipcMain.handle('video:get:info', async (event: IpcMainInvokeEvent, filePath: string): Promise<VideoInfo> => {
  try {
    const result = await runProcess(ffprobePath, [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      '-sexagesimal',
      filePath
    ])

    const sexagesimal = result
      .replace(/\n/g, '')
      .split(':')
      .map(x => Math.ceil(Number(x)).toString().padStart(2, '0'))
      .join(':')

    return {
      inputPath: filePath,
      path: path.dirname(filePath),
      sexagesimal,
      seconds: sexagesimalToSeconds(sexagesimal)
    }
  } catch (error) {
    throw error
  }
})

ipcMain.handle(
  'video:split',
  async (event: IpcMainInvokeEvent, params: { video: VideoElement; parts: number }): Promise<void> => {
    try {
      const promises = []
      const durationChunk = params.video.seconds / params.parts
      for (let i = 0; i < params.parts; ++i) {
        const from = i * durationChunk
        const to = from + durationChunk
        const extension = path.extname(params.video.name)
        const outputFilename = params.video.name.replace(extension, `__${i + 1}${extension}`)
        promises.push(
          runProcess(ffmpegPath, [
            '-v',
            'error',
            '-stats',
            '-ss',
            secondsToSexagesimal(from),
            '-i',
            params.video.inputPath,
            '-to',
            secondsToSexagesimal(to),
            '-codec',
            'copy',
            '-avoid_negative_ts',
            'make_zero',
            path.join(params.video.path, outputFilename)
          ])
        )
      }
      await Promise.all(promises)
    } catch (error) {
      throw error
    }
  }
)

ipcMain.handle('dialog:get:directory', async (event: IpcMainInvokeEvent, defaultPath: string): Promise<string> => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    defaultPath,
    buttonLabel: 'Select',
    properties: ['openDirectory']
  })
  if (canceled) {
    return ''
  } else {
    return filePaths[0]
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
