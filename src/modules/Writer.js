//Creator Pierre Reimertz MIT ETC ETC

const timeoutMap = new Map()

timeoutMap.set('#', 50 / 2) //delete
timeoutMap.set('@', 250 / 2) //pause
timeoutMap.set(',', 350 / 2)
timeoutMap.set('-', 350 / 2)
timeoutMap.set('.', 500 / 2)
timeoutMap.set('?', 750 / 2)

export default class Writer {
  constructor({ input, onUpdate, onDone, instant }) {
    this.timeout = null
    this.output = ''
    this.input = input || ''
    this.immutableInput = input
    this.onUpdate = onUpdate || null
    this.isFinished = false
    this.onDone = onDone
    this.instant = instant || false
  }

  updateWriter = character => {
    if (character === '?') return this.output
    if (character === '!') return (this.output = '')
    if (character === '#') return (this.output = this.output.slice(0, -1))
    if (character === '&') {
      let pasteIn = this.input.split('&')[0]
      this.output += pasteIn
      return (this.input = this.input.substring(pasteIn.length + 1, this.input.length))
    } else return (this.output += character)
  }

  write = instant => {
    let text, msDelay
    if (this.input.length === 0) return this.isDone()

    text = this.input.substring(0, 1)
    this.input = this.input.substring(1, this.input.length)
    this.updateWriter(text)

    if (this.onUpdate) this.onUpdate(this.output)

    if (instant) return this.write(true)

    msDelay = timeoutMap.get(text) || Math.random() * 150

    this.timeout = setTimeout(() => {
      this.write()
    }, msDelay)
  }

  start = () => {
    this.write()
  }

  stop = () => {
    clearTimeout(this.timeout)
    this.isFinished = true
  }

  reset = () => {
    this.stop()
    this.input = this.immutableInput
    this.output = ''

    if (this.onUpdate) this.onUpdate(this.output)
  }

  isDone = () => {
    this.isFinished = true
    if (this.onDone) this.onDone()
  }
}
