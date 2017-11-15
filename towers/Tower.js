class Tower {
  constructor (game, phaserRef, pos) {
    this.game = game
    this.phaserRef = phaserRef
    this.pos = pos
    this.popup = null
    phaserRef.inputEnabled = true
    phaserRef.events.onInputDown.add(this.infoPopup, this)

    //TODO: x,y,radius,cooldown(shooting interval)
    //what about cost?
    //change pos to x,y?
  }
  // Tower per frame logic
  update (game, enemies) {
    this.aimAt(game, this.target(enemies))
  }
  // Implement targeting algorithm here to select target within
  // tower attack radius
  target (enemies) {
    // target logic
  }
  // Pass in game and rotate tower towards enemy
  aimAt (game, enemy) {
    this.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, game.input.mousePointer) + 90
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
