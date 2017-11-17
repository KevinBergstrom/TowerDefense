class Tower {
  constructor (phaserRef, pos, range) {
    this.phaserRef = phaserRef
    this.pos = pos
    this.range = range ? range : 150 // give range value, default to 150 if not given AKA constructor overloading...just like JAVA!
    this.popup = null
    phaserRef.inputEnabled = true
    phaserRef.events.onInputDown.add(this.infoPopup, this)

    this.interval = 80
    this.cooldown = 0

    //what about cost?
  }
  // Tower per frame logic
  update (enemies, projectiles, model) {
    let currentTarget = this.target(this.getInRange(enemies))
    this.aimAt(currentTarget)

    if(this.cooldown <= 0){
      if (currentTarget) {
        this.cooldown = this.interval
        this.shootAt(currentTarget,projectiles)
      }
    } else {
      this.cooldown--
    }
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

  shootAt(enemy,projectiles){
    let dist = Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y)
    let vector = {x: (enemy.x-this.pos.x)/dist, y: (enemy.y-this.pos.y)/dist}
    let damage = 100 //change to Number.POSITIVE_INFINITY for UNLIMITED POWER!
    let speed = 20

    let proj = factory.createProjectile('missile',this.pos.x,this.pos.y,vector,speed,damage)

    proj.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    projectiles.push(proj)
  }

  // Pass in game and rotate tower towards enemy
  aimAt (enemy) {
    if (enemy) {
      this.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    }
  }

  infoPopup () {//TODO
    if (this.popup) {
      return
    }
    const popup = new SlickUI.Element.Panel(this.phaserRef.x, this.phaserRef.y - 116, 150, 100)
    this.popup = popup
    slickUI.add(popup)

    const cancelBtn = new SlickUI.Element.Button(77, 60, 64, 32)
    popup.add(cancelBtn)
    cancelBtn.add(new SlickUI.Element.Text(0, 0, "Close"))
    cancelBtn.events.onInputUp.add(this.clearPopup, this)

    const upgradeBtn = new SlickUI.Element.Button(0, 0, 150, 32)
    popup.add(upgradeBtn)
    upgradeBtn.add(new SlickUI.Element.Text(4, 0, "Upgrade: 40"))
    upgradeBtn.events.onInputUp.add(this.upgrade, this)
  }

  upgrade () {
    if (this.interval > 40 && model.moneyCheck(40)) {
    	this.interval /= 2
    	model.changeMoney(-40)
    }
    this.clearPopup()
  }

  clearPopup () {
    this.popup.destroy()
    this.popup = null
  }
 }
