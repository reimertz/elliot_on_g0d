import React, { Component } from 'react'

import Voice from './modules/Voice'

import Writer from './modules/Writer'
import ConsoleOutput from './modules/ConsoleOutput'
import Rant from './modules/Rant'
import Ascii from './modules/Ascii'

import LoginScreen from './components/LoginScreen'
import Console from './components/Console'

export default class ElliotOnG0d extends Component {
  state = {
    loggedIn: false,
    hackDone: false,
    rantDone: false,
    consoleOutput: ''
  }

  constructor() {
    super()
    this.voice = new Voice()
    this.voice.init()
  }

  initModules = () => {
    this.writer = new Writer({
      input: ConsoleOutput,
      onDone: () => {
        this.hackIsDone()
      },
      onUpdate: output => {
        return this.setState(state => {
          return { consoleOutput: output }
        })
      }
    })

    this.ascii = new Ascii({
      source: '.Hidden-Gif',
      destination: '.Ascii',
      width: 150,
      fps: 10,
      invert: true
    })
  }

  hackIsDone = () => {
    this.setState(state => {
      return {
        hackDone: true
      }
    })

    Rant.map(a => {
      return setTimeout(() => {
        this.voice.say(a[0], a[1])
        this.setState(state => {
          return { consoleOutput: a[0] }
        })
      }, a[2])
    })

    setTimeout(() => {
      this.rantDone()
    }, Rant[Rant.length - 2][2])

    this.ascii.superGif.move_to(0)
    this.ascii.play()
  }

  rantDone = () => {
    this.setState(state => {
      return {
        rantDone: true
      }
    })
  }

  onLogin = () => {
    this.setState(state => {
      return {
        loggedIn: true
      }
    })

    this.writer.start()
  }

  onKey = event => {
    if (event.ctrlKey && event.keyCode === 67) window.location.reload()
  }

  componentDidMount() {
    this.initModules()
    window.addEventListener('keydown', this.onKey)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKey)
  }

  render() {
    const { consoleOutput, loggedIn, rantDone } = this.state

    window.scrollTo(0, document.body.scrollHeight)

    return (
      <main>
        <pre className="Ascii" />
        {!loggedIn
          ? <LoginScreen onClick={this.onLogin} />
          : rantDone
            ? false
            : <Console>
                {consoleOutput}
              </Console>}
        <img alt="Hidden-Gif" className="Hidden-Gif" src={require('./assets/elliot_on_god.gif')} />
        <p className="Reimertz">
          <a href="https://twitter.com/reimertz">@reimertz</a>
          <span> | </span>
          <a href="https://github.com/reimertz/elliot_on_g0d">source</a>
        </p>
      </main>
    )
  }
}
