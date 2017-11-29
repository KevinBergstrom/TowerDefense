class Tower {
  constructor (phaserRef, type, pos, range, cost) {
    this.phaserRef = phaserRef
    this.type = type
    this.pos = pos
    this.range = range ? range : 150 // give range value, default to 64 if not given AKA constructor overloading...just like JAVA!
    this.damage = 100 //change to Number.POSITIVE_INFINITY for UNLIMITED POWER!
    this.speed = 20
    this.level = 0
    this.cost = cost ? cost : 100
    this.investment = cost ? cost : 100

    if(this.type == 'missileTower'){
      this.projectil = 'missile'
    }
    else{
      this.projectil = 'lazer'
    }

    if(this.range<56){
      this.range = 56
    }

    this.popup = null
    phaserRef.inputEnabled = true
    phaserRef.events.onInputDown.add(this.upgrade, this)

    this.interval = 80
    this.cooldown = 0

    this.gridX = Math.floor((pos.x/CANVAS_WIDTH)*GRID_SIZE)
    this.gridY = Math.floor((pos.y/(CANVAS_HEIGHT-PURCHASE_BUTTON_SIZE-10))*GRID_SIZE)

    this.spotsInRange = []
    this.gridPoint

    //what about cost?
  }

  removeThis (gridPoint,array) {
    this.phaserRef.kill()
    array.splice((array.indexOf(this)),1)
    gridPoint.set(null)
    delete this
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

  generateInRange(grid){

    this.spotsInRange = []

    let gridRange = Math.floor((this.range+GRID_SIZE)/GRID_SIZE/2)

    let minX = this.gridX-gridRange+1
    let maxX = this.gridX+gridRange-1
    let minY = this.gridY-gridRange
    let maxY = this.gridY+gridRange

    if(minX<0){
      minX = 0
    }
    if(maxX>GRID_SIZE-1){
      maxX = GRID_SIZE-1
    }
    if(minY<0){
      minY = 0
    }
    if(maxY>GRID_SIZE-1){
      maxY = GRID_SIZE-1
    }

    for(var x = minX;x<=maxX;x++){
      for(var y = minY;y<=maxY;y++){

        let gridPoint = grid.getPoint(x,y)
        let dist = Phaser.Math.distance(gridPoint.x, gridPoint.y, this.pos.x, this.pos.y)
        
        if((!gridPoint.isOccupied()||gridPoint.allowsPassage())&&dist <= this.range+5&&gridPoint.hasPath==true){
          this.spotsInRange.push(gridPoint)
          //for debugging
          //let b = factory.createEnemy('enemy', gridPoint.x, gridPoint.y, 1, 1, 1, null, true)

        }

      }
    }

  }

  getInRange (enemies) {
    return this.getInRangeLast(enemies)
  }

  getInRangeClosest(enemies){
    const inRange = []

    let smallDist = this.range
    for(var i = 0;i<this.spotsInRange.length;i++){
      this.spotsInRange[i].enemies.forEach(enemy => {
        let dist = Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y)
        if ( dist <= smallDist) {
          inRange.unshift(enemy)
          smallDist = dist
        }
      })
    }

    return inRange
  }

  getInRangeLast(enemies){
    const inRange = []

    let mark = Number.POSITIVE_INFINITY
    for(var i = 0;i<this.spotsInRange.length;i++){
      this.spotsInRange[i].enemies.forEach(enemy => {
        let dist = Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y)
        if ( dist <= this.range && (enemy.path.length-enemy.landmark)<mark) {
          inRange.unshift(enemy)
          mark = (enemy.path.length-enemy.landmark)
        }
      })
    }

    return inRange
  }

  getInRangeFirst(enemies){
    const inRange = []

    let mark = -1
    for(var i = 0;i<this.spotsInRange.length;i++){
      this.spotsInRange[i].enemies.forEach(enemy => {
        let dist = Phaser.Math.distance(enemy.x, enemy.y, this.pos.x, this.pos.y)
        if ( dist <= this.range && (enemy.path.length-enemy.landmark)>mark) {
          inRange.unshift(enemy)
          mark = (enemy.path.length-enemy.landmark)
        }
      })
    }

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

    let proj = factory.createProjectile(this.projectil,this.pos.x,this.pos.y,vector,this.speed,this.damage)
    soundPlayer.play('laser')
    proj.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    projectiles.push(proj)
  }

  // Pass in game and rotate tower towards enemy
  aimAt (enemy) {
    if (enemy) {
      this.phaserRef.rotation = game.physics.arcade.angleBetween(this.phaserRef, enemy) + (90*Math.PI)/180
    }
  }

  upgrade () {
    towerUpgrader.upgradeTower(this)
  }

  invest (price) {
    this.investment += price
  }
 }
