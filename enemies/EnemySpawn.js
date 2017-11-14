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
		//TODO

		for(var i = 0; i< waveNumber;i++){
			spawnQueue.push(new Enemy(this.game,this.game.getEnemySprite(this.x,this.y),this.x,this.y,100,0.1,1,this.path))
		}
		cooldown = interval
	}

	spawnEnemy(enemyArray){
		//TODO
		newEnemy = this.spawnQueue.shift()
		newEnemy.path = this.path
		enemyArray.push(newEnemy)//then do something in index.js?
	}

	finished(){
		if(spawnQueue.length == 0){
			return true
		}else{
			return false
		}
	}

	update(enemyArray){
		if(!this.finished){
			if(this.cooldown<=0){
				this.spawnEnemy(enemyArray)
				cooldown = interval
			}else{
				this.cooldown = this.cooldown - 1
			}
		}
	}

}