class Projectile{

	constructor (phaserRef, x, y, vector, speed, damage) {

		this.phaserRef = phaserRef
		this.x = x
		this.y = y
		this.vector = vector // movement vector = {x: xmove, y: ymove}
		this.speed = speed// should be very small (pixels per frame)
		this.damage = damage
		this.range = speed
	}

	move () {
		this.x = this.x + this.speed*this.vector.x
		this.y = this.y + this.speed*this.vector.y
		this.phaserRef.x = this.x
		this.phaserRef.y = this.y
	}

	hit (enemy,projectiles) {
		//default hit function
		if (enemy.health > 0) {
			enemy.health -= this.damage
			this.removeThis(projectiles)
			if (enemy.health < 0) {
				enemy.health = 0
			}
		}
	}

	collisions (enemies,projectiles) {
	    const inRange = []

	    enemies.forEach(enemy => {
	      let dist = Phaser.Math.distance(enemy.x, enemy.y, this.x, this.y)
	      if (dist <= this.range) {
	        inRange.push(enemy)
	      }
	    })
	    return inRange 
	}

	removeThis (array) {
		this.phaserRef.kill()
		array.splice(array.indexOf(this), 1)
	}

	update (enemies,projectiles) {
		this.move()

    let currentTarget = this.collisions(enemies, projectiles)

	      if(currentTarget.length > 0){
	        this.hit(currentTarget[0],projectiles)
		  }

		if(this.x < 0 ||this.x > 800 || 
		   this.y < 0 ||this.y > 650 - 140 - 16){
			this.removeThis(projectiles)
		}
		//TODO
	}

}