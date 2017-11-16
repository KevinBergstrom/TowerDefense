class EnemySpawn{

	constructor(game, phaserRef,x,y,interval){
		this.game = game
		this.phaserRef = phaserRef
		this.x = x
		this.y = y
		this.interval = interval
		this.cooldown = interval
		this.spawnQueue = []
	}

	setPath(newPath){
		this.path = newPath
	}

	populateSpawnQueue(waveNumber){

		if(this.interval > 10){
			this.interval--
		}

		for(var i = 0; i< waveNumber;i++){
			let speed = 1
			let damage = waveNumber
			let health = 50 + waveNumber*waveNumber
			this.spawnQueue.push(new Enemy(this.game,undefined,this.x,this.y,health,speed,damage,this.path))
		}
		this.cooldown = this.interval
	}

	addEnemySprite(x,y){
	  // Add a new spawn sprite to the game
	  const enemySprite = this.game.add.sprite(x, y, 'enemy')
	  // Offset the sprite to center it
	  enemySprite.pivot.x = 64
	  enemySprite.pivot.y = 64
	  // Scale the sprite to proper size
	  enemySprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
	  return enemySprite
	}

	spawnEnemy(enemyArray){
		//TODO
		let newEnemy = this.spawnQueue.shift()
		newEnemy.path = this.path
		newEnemy.phaserRef = this.addEnemySprite(this.x,this.y)
		enemyArray.push(newEnemy)
	}

	finished(){
		if(this.spawnQueue.length == 0){
			return true
		}else{
			return false
		}
	}

	update(enemyArray){
		if(!this.finished()){
			if(this.cooldown<=0){
				this.spawnEnemy(enemyArray)
				this.cooldown = this.interval
			}else{
				this.cooldown = this.cooldown - 1
			}
		}
	}

}