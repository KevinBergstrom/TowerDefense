class Projectile{

	constructor (phaserRef, x, y, vector, speed, damage) {

		this.phaserRef = phaserRef
		this.x = x
		this.y = y
		this.vector = vector // movement vector = {x: xmove, y: ymove}
		this.speed = speed   // should be very small (pixels per frame)
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
		if (enemy.getHealth() > 0) {
			enemy.takeDamage(this.damage)
			this.removeThis(projectiles)
			if (enemy.getHealth() < 0) {
				enemy.getHealth() = 0
			}
		}
	}

	collisions (grid,projectiles) {
	//TODO make this use gridPosition.enemeis[] for collision detection
		const inRange = []
		let gridX = Math.floor((this.x/CANVAS_WIDTH)*GRID_SIZE)
		let gridY = Math.floor((this.y/(CANVAS_HEIGHT-PURCHASE_BUTTON_SIZE-10))*GRID_SIZE)
		
		if(gridX>=0 && gridY>=0 && gridX<GRID_SIZE && gridY<GRID_SIZE){
			let gridPoint = grid.getPoint(gridX,gridY)


			//if(gridPoint.hasPath){
			    gridPoint.enemies.forEach(enemy => {
			      let dist = Phaser.Math.distance(enemy.x, enemy.y, this.x, this.y)
			      if (dist <= this.range) {
			        inRange.push(enemy)
			      }
			    })
			    return inRange 
			//}
		}

		return []
	}

	removeThis (array) {
		this.phaserRef.destroy()
		array.splice(array.indexOf(this), 1)
		delete this
	}

	update (grid,projectiles) {
		this.move()

			//TODO update this to make it more efficient
    	  let currentTarget = this.collisions(grid, projectiles)

	      if(currentTarget.length > 0){
	        this.hit(currentTarget[0],projectiles)
		  }

		if(this.x < 0 ||this.x > CANVAS_WIDTH || 
		   this.y < 0 ||this.y > CANVAS_HEIGHT - PURCHASE_BUTTON_SIZE - 16){
			this.removeThis(projectiles)
		}
	}

}

