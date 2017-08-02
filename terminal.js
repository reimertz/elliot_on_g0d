const blessed = require('blessed')
const Rant = require('./src/modules/Rant')
const say = require('say')
const { exec } = require('child_process')

const screen = blessed.screen({
  smartCSR: true,
  align: 'center'
})

screen.title = 'elliot_on_g0d'

const gif = blessed.image({
  parent: screen,
  ascii: ['@', '#', '$', '=', '*', '!', ';', ':', '~', '-', ',', '.', '&nbsp;', '&nbsp;'],
  align: 'center',
  height: 30,
  width: 75,
  left: 3,
  top: 3,
  file: './src/assets/elliot_on_god_small.gif'
})

const text = blessed.box({
  parent: screen,
  top: 34,
  left: 3,
  align: 'left',
  content: ''
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0)
})

screen.render()

Rant.map(a => {
  setTimeout(() => {
    if (a[1] == 'm1') say.speak(a[0], 'Alex')
    else say.speak(a[0], 'Samantha')
    text.setContent(a[0])
  }, a[2])
})
