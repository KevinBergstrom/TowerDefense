class Projectile{

	constructor(game,phaserRef,x,y,vector,speed,damage){

		this.game = game
		this.phaserRef = phaserRef
		this.x = x
		this.y = y
		this.vector = vector // movement vector = {x: xmove, y: ymove}
		this.speed = speed// should be very small (pixels per frame)
		this.damage = damage
	}

	move(){
		this.x = this.x + this.speed*this.vector.x
		this.y = this.y + this.speed*this.vector.y
		this.phaserRef.x = this.x
		this.phaserRef.y = this.y
	}

	hit(){
		//TODO
	}

	removeThis(projectiles){
		this.phaserRef.kill()
		projectiles.splice((projectiles.indexOf(this)),1)
	}

	update(enemies,projectiles){
		this.move()
		if(this.x<0 || this.x>800 || 
		   this.y<0 ||this.y>650-140-16){
			this.removeThis(projectiles)
		}
		//TODO
	}

}