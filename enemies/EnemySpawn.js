class EnemySpawn{

	constructor (phaserRef, x, y, interval) {
		this.phaserRef = phaserRef
		this.x = x
		this.y = y
		this.interval = interval
		this.cooldown = interval
		this.spawnQueue = []
	}

	setPath (newPath) {
		this.path = newPath
	}

	populateSpawnQueue (waveNumber) {

		for(var i = 0; i < waveNumber; i++){
			let speed = 1
			let damage = 1
			let health = 100 + waveNumber*waveNumber

			let newEnemy = factory.createEnemy('enemy',this.x, this.y, health, speed, damage, this.path,false)

			this.spawnQueue.push(newEnemy)
		}
		this.cooldown = this.interval
	}

	spawnEnemy (enemyArray,grid){
		let newEnemy = this.spawnQueue.shift()
		newEnemy.path = this.path
		newEnemy.phaserRef.visible = true

		let gridX = Math.floor((newEnemy.x/CANVAS_WIDTH)*GRID_SIZE)
        let gridY = Math.floor((newEnemy.y/(CANVAS_HEIGHT-PURCHASE_BUTTON_SIZE-10))*GRID_SIZE)

        grid.getPoint(gridX,gridY).enemies.push(newEnemy)

		enemyArray.push(newEnemy)
	}

	finished () {
		return this.spawnQueue.length == 0
	}

	update (enemyArray,grid) {
		if (!this.finished()) {
			if (this.cooldown <= 0) {
				this.spawnEnemy(enemyArray,grid)
				this.cooldown = this.interval
			} else {
				this.cooldown = this.cooldown - 1
			}
		}
	}

	clearPopup(){
		
	}

}

