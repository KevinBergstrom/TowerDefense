class SoundPlayer {
  constructor () {
    this.sounds = []
  }
  load (sounds) {
    sounds.forEach(sound => {
      game.load.audio(sound.name, sound.link)
      this.sounds.push(sound)
    })
  }
  cache () {
    this.sounds.forEach(sound => {
      this[sound.name] = game.add.audio(sound.name)
    })
  }
  play (sound) {
    this[sound].play()
  }
  loop (sound, volume) {
    this[sound].loopFull(volume ? volume : 0.3)
  }
}

