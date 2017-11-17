class Enemy{

	constructor(phaserRef, x, y, health, speed, damage, path) {
		this.phaserRef = phaserRef//sprite
		this.x = x
		this.y = y
		this.health = health
		this.speed = speed
		this.damage = damage
		this.path = path
		this.landmark = 0//last place in the path the enemy has been
		this.destReached = false
	}

	changePath (newPath) {
		this.path = newPath
	}

	move () {

		if (this.landmark == this.path.length-1) {
			this.destReached = true
		} else {

			let newPoint = this.path[this.landmark+1]
			let moveX = newPoint.x - this.x
			let moveY = newPoint.y - this.y

			if (Math.abs(moveX) <= this.speed*2) {
				this.x = newPoint.x
				moveX = 0
			}
			if (Math.abs(moveY) <= this.speed*2) {
				this.y = newPoint.y
				moveY = 0
			}

			if (moveX > 0) {
				this.phaserRef.angle = 0
				this.x += this.speed
			} else if (moveX < 0) {
				this.phaserRef.angle = 180
				this.x -= this.speed
			} else if (moveY > 0) {
				this.phaserRef.angle = 90
				this.y += this.speed
			} else if (moveY < 0) {
				this.phaserRef.angle = 270
				this.y -= this.speed
			} else if (moveX == 0 && moveY == 0) {
				this.landmark++
			}
		this.phaserRef.x = this.x
		this.phaserRef.y = this.y
		}
	}

	damageTo () {
		return this.damage
	}

	bounty () {
		return 1//how much an enemy gives when killed
	}

	removeThis (array) {
		this.phaserRef.kill()
		array.splice((array.indexOf(this)),1)
	}

	update () {
		//TODO
		if (this.health > 0) {
			this.move()
		}
	}

}