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

		if(this.interval > 10){
			this.interval--
		}

		for(var i = 0; i < waveNumber; i++){
			//change this. I dare you to
			let speed = 1 + 0.01*waveNumber
			let damage = waveNumber
			let health = 100 + waveNumber*waveNumber

			let newEnemy = factory.createEnemy('enemy',this.x, this.y, health, speed, damage, this.path,false)

			this.spawnQueue.push(newEnemy)
		}
		this.cooldown = this.interval
	}

	spawnEnemy (enemyArray) {
		//TODO
		let newEnemy = this.spawnQueue.shift()
		newEnemy.path = this.path
		newEnemy.phaserRef.visible = true
		enemyArray.push(newEnemy)
	}

	finished () {
		return this.spawnQueue.length == 0
	}

	update (enemyArray) {
		if (!this.finished()) {
			if (this.cooldown <= 0) {
				this.spawnEnemy(enemyArray)
				this.cooldown = this.interval
			} else {
				this.cooldown = this.cooldown - 1
			}
		}
	}

	clearPopup(){
		//maybe in the future
	}

}