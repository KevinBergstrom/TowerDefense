class Tower {
  constructor (game, phaserRef, pos, range) {
    this.game = game
    this.phaserRef = phaserRef
    this.pos = pos
    this.range = range ? range : 150 // give range value, default to 150 if not given
    this.popup = null
    phaserRef.inputEnabled = true
    phaserRef.events.onInputDown.add(this.infoPopup, this)

    this.interval = 60
    this.cooldown = 0

    //what about cost?
  }
  // Tower per frame logic
  update (game, enemies, projectiles) {

    let currentTarget = this.target(this.getInRange(enemies))
    this.aimAt(game, currentTarget)

    if(this.cooldown<=0){
      if(currentTarget!==undefined){
        this.cooldown = this.interval
        this.shootAt(currentTarget,projectiles)
      }
    }else{
      this.cooldown--
    }

  }

  getInRange (enemies) {
    const inRange = []

    enemies.forEach(enemy => {
      let dist = Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y)
      if (dist <= this.range) {
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

  shootAt(enemy,projectiles){
    let dist = Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y)
    let vector = {x: (enemy.x-this.pos.x)/dist, y: (enemy.y-this.pos.y)/dist}
    let damage = 50
    let speed = 10
    let proj = new Projectile(this.game,this.addProjectileSprite(this.pos.x,this.pos.y),this.pos.x,this.pos.y,vector,speed,damage)
    proj.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    projectiles.push(proj)
  }

  // Pass in game and rotate tower towards enemy
  aimAt (game, enemy) {
    if (enemy) {
      this.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    }
  }

  addProjectileSprite(x,y){
    // Add a new proj sprite to the game
    const projSprite = this.game.add.sprite(x, y, 'missile')
    // Offset the sprite to center it
    projSprite.pivot.x = 64
    projSprite.pivot.y = 64
    // Scale the sprite to proper size
    projSprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
    return projSprite
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
