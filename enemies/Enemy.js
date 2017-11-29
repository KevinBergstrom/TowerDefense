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
		this.gridX = Math.floor((x/CANVAS_WIDTH)*GRID_SIZE)
		this.gridY = Math.floor((y/(CANVAS_HEIGHT-PURCHASE_BUTTON_SIZE-10))*GRID_SIZE)
	}

	changePath (newPath) {
		this.path = newPath
	}

	move (grid) {

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

		let oldGridX = this.gridX
		let oldGridY = this.gridY

		let newGridX = Math.floor((this.x/CANVAS_WIDTH)*GRID_SIZE)
		let newGridY = Math.floor((this.y/(CANVAS_HEIGHT-PURCHASE_BUTTON_SIZE-10))*GRID_SIZE)

		if(oldGridX!=newGridX || oldGridY!=newGridY){

			grid.getPoint(oldGridX,oldGridY).enemies.splice(grid.getPoint(oldGridX,oldGridY).enemies.indexOf(this), 1)
			grid.getPoint(newGridX,newGridY).enemies.push(this)

			this.gridX = newGridX
			this.gridY = newGridY
			
		}

		}
	}

	damageTo () {
		return this.damage
	}

	bounty () {
		return 1//how much an enemy gives when killed
	}

	removeThis (array,grid) {
		this.phaserRef.destroy()
		grid.getPoint(this.gridX,this.gridY).enemies.splice(grid.getPoint(this.gridX,this.gridY).enemies.indexOf(this), 1)
		array.splice((array.indexOf(this)),1)
		delete this
	}

	update (grid) {
		//TODO
		if (this.health > 0) {
			this.move(grid)
		}
	}

}

