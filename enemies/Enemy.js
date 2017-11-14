class Enemy{

	constructor(game,phaserRef,x,y,health,speed,damage,path){
		this.game = game
		this.phaserRef = phaserRef//sprite
		this.x = x
		this.y = y
		this.health = health
		this.speed = speed
		this.damage = damage
		this.path = path
		this.landmark = 0//last place in the path the enemy has been
	}

	changePath(newPath){
		this.path = newPath
	}

	update(){
		//TODO
	}

}