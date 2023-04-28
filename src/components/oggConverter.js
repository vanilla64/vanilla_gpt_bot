import axios from "axios";
import ffmpeg  from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { removeFile } from "../utils/removeFile.js";

const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path)
  }

  convertToMp3(inputPath, fileName) {
    try {
      const mp3Path = resolve(dirname(inputPath), `${fileName}.mp3`)
      return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .inputOption('-t 30')
          .output(mp3Path)
          .on('end', () => {
            resolve(mp3Path)
            removeFile(inputPath)
          })
          .on('error', (err) => reject(err.message))
          .run()
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  async saveOgg(url, filename) {
    try {
      const oggPath = resolve(__dirname, '../../voices', `${filename}.ogg`)
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      })

      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath)
        response.data.pipe(stream)
        stream.on('finish', () => resolve(oggPath))
      })
    } catch (e) {
      console.log(e.message)
    }
  }
}

export const oggConverter = new OggConverter()
