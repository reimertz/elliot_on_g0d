//Creator Pierre Reimertz MIT ETC ETC

import SuperGif from './SuperGif'

export default class Ascii {
  constructor({
    chars = ['@', '#', '$', '=', '*', '!', ';', ':', '~', '-', ',', '.', '&nbsp;', '&nbsp;'],
    source = '[data-ascii-source]',
    destination = '[data-ascii-destination]',
    width = 200,
    fps = 24,
    autoPlay = false,
    invert = false,
    onLoad = false
  }) {
    this.chars = invert ? chars.reverse() : chars
    this.chars = Array.from(Array(256).keys()).map(i => {
      return this.chars[parseInt(i / 255 * (this.chars.length - 1), 10)]
    })

    this.source = document.querySelector(source)
    this.destination = document.querySelector(destination)
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.width = width
    this.height = this.width
    this.fps = fps
    this.autoPlay = autoPlay

    this.onLoad = onLoad

    this.isPlaying = false
    this.ratio = 1
    this.timeout = false
    this.imageData = false
    this.superGif = false

    this.__bindFunctions.call(this)
    this.__setType.call(this)
    this.__addEventListeners.call(this)
  }

  __throwError(errorString) {
    throw new Error(`Ascii Error: ${errorString}`)
  }

  __bindFunctions() {
    this._fastMod = this._fastMod.bind(this)
    this._getAsciiFromLatestFrame = this._getAsciiFromLatestFrame.bind(this)
    this._initialRender = this._initialRender.bind(this)
    this._renderFrame = this._renderFrame.bind(this)

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
  }

  __setType() {
    if (this.source.nodeName === 'VIDEO') {
      this.type = 0
    } else if (this.source.nodeName === 'IMG') {
      if (~this.source.src.toLowerCase().indexOf('.gif')) {
        this.type = 1
        this.superGif = new SuperGif({
          gif: this.source,
          max_width: this.width
        })
      } else this.type = 2
    }
  }

  __addEventListeners() {
    const func = this.type === 0 ? 'loadeddata' : 'load'

    if (this.type === 1) {
      this.superGif.load(() => {
        this.canvas = this.superGif.get_canvas()
        this.ctx = this.canvas.getContext('2d')

        if (this.onLoad) this.onLoad()

        if (this.autoPlay) {
          this.superGif.move_to(0)
          this._initialRender()
        }
      })
    }

    this.source.addEventListener(func, () => {
      if (this.onLoad) this.onLoad()
      if (this.autoPlay) this._initialRender()
    })
  }

  _fastMod(dividend, divisor) {
    if (dividend === 0) return false

    while (dividend >= divisor) {
      dividend -= divisor
    }

    return dividend === 0
  }

  _initialRender() {
    const { type, source } = this

    this.ratio = type === 0 ? source.videoHeight / source.videoWidth : source.height / source.width

    if (Number.isNaN(this.ratio)) return setTimeout(this._initialRender, 200)

    this.height = parseInt(this.width * this.ratio, 10)

    if (type === 1 || type === 0) {
      this.setTimeout = setTimeout(this._renderFrame.bind(this, 0), 1000 / this.fps)
    }
  }

  _getAsciiFromLatestFrame() {
    const { imageData, width, _fastMod } = this
    let buf32 = new Uint32Array(imageData.data.buffer)

    return buf32.reduce((prev, pixel, i) => {
      let maxBrightness = [pixel >> 16, pixel >> 8, pixel].reduce((prev, mask) => {
        return Math.max(prev, mask & 0xff)
      }, 0)

      if (_fastMod(i, width)) {
        return prev + this.chars[maxBrightness] + '\n'
      } else {
        return prev + this.chars[maxBrightness]
      }
    }, '')
  }

  _renderFrame(frameOffset) {
    const { ctx, destination, width, height, _getAsciiFromLatestFrame } = this

    this.superGif.move_to(frameOffset++)

    if (this.type !== 1) {
      ctx.drawImage(this.source, 0, 0, width, height)
    }

    this.imageData = ctx.getImageData(0, 0, width, height)
    destination.innerHTML = _getAsciiFromLatestFrame()

    if (this.type === 0 || this.type === 1) {
      this.setTimeout = setTimeout(this._renderFrame.bind(this, frameOffset), 1000 / this.fps)
    }
  }

  // API
  play() {
    if (!this.isPlaying) this._initialRender()
  }

  pause() {
    if (this.isPlaying) clearInterval(this.setTimeout)
  }
}
