import path from 'path'
import os from 'os'
import { spawn } from 'child_process'
import { app } from 'electron'

const getBinariesPath = () => {
  const IS_PROD = process.env.NODE_ENV === 'production'
  const { isPackaged } = app

  const binariesPath =
    IS_PROD && isPackaged
      ? path.join(process.resourcesPath, './bin')
      : path.join(app.getAppPath(), 'resources', 'mac', process.arch)

  return binariesPath
}

export const ffmpegPath = path.resolve(path.join(getBinariesPath(), './ffmpeg'))

export const ffprobePath = path.resolve(path.join(getBinariesPath(), './ffprobe'))

export const runProcess = async (cmd: string, args?: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args)

    let output = ''
    let error = ''

    process.stdout.on('data', data => {
      output += data.toString()
    })

    process.stderr.on('data', data => {
      error += data.toString()
    })

    process.on('close', code => {
      if (code !== 0) {
        reject({ code, error })
      } else {
        resolve(output)
      }
    })
  })
}

export const prettyPath = (filePath: string): string => path.normalize(filePath.replace(os.homedir(), '~'))
