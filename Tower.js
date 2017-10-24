class Tower {
  constructor (game, phaserRef, pos) {
    this.game = game
    this.phaserRef = phaserRef
    this.pos = pos
  }
  // Tower per frame logic
  update (game, enemies) {
    this.aimAt(game, enemies)
  }
  // Implement targeting algorithm here to select target within
  // tower attack radius
  targetIn (enemies) {
    // target logic
  }
  // Pass in game and rotate tower towards enemy
  aimAt (game, enemy) {
    // this.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, game.input.mousePointer) + 90
  }
}
