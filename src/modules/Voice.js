export default class Voice {
  constructor() {
    this.meSpeak = window.meSpeak
  }

  init() {
    this.meSpeak.loadConfig('meSpeak/mespeak_config.json')
    this.meSpeak.loadVoice('meSpeak/en-us.json')
    this.say(' ') // hack to make sure voice works in IOS
  }

  mute(toggle) {
    this.meSpeak.setVolume(toggle ? 0 : 1)
  }

  say(sentence, variant = 'm1', speed = 155) {
    if (this.meSpeak.isConfigLoaded()) {
      this.meSpeak.speak(sentence, { variant: variant, speed: speed })
    } else {
      return new Error('Voice not initiated. :(')
    }
  }
}
