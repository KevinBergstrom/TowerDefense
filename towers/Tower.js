class Tower {
  constructor (game, phaserRef, pos, range) {
    this.game = game
    this.phaserRef = phaserRef
    this.pos = pos
    this.range = range ? range : 150 // give range value, default to 150 if not given
    this.popup = null
    phaserRef.inputEnabled = true
    phaserRef.events.onInputDown.add(this.infoPopup, this)

    //TODO: x,y,radius,cooldown(shooting interval)
    //what about cost?
    //change pos to x,y?
  }
  // Tower per frame logic
  update (game, enemies) {
    this.aimAt(game, this.target(this.getInRange(enemies)))
  }

  getInRange (enemies) {
    const inRange = []

    enemies.forEach(enemy => {
      if (Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y) <= this.range) {
        inRange.push(enemy)
      }
    })

    return inRange
  }
  // Implement targeting algorithm here to select target within
  // tower attack radius
  target (enemies) {
    // target logic
    if (enemies.length) {
      return enemies[0]
    }
  }
  // Pass in game and rotate tower towards enemy
  aimAt (game, enemy) {
    if (enemy) {
      this.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    }
  }
  infoPopup () {
    const popup = new SlickUI.Element.Panel(this.phaserRef.x, this.phaserRef.y - 116, 150, 100)
    this.popup = popup
    slickUI.add(popup)
    const cancelBtn = new SlickUI.Element.Button(77, 60, 64, 32)
    popup.add(cancelBtn)
    cancelBtn.add(new SlickUI.Element.Text(0, 0, "Close"))
    cancelBtn.events.onInputUp.add(this.clearPopup, this)
  }
  clearPopup () {
    this.popup.destroy()
    this.popup = null
  }
 }
