class Projectile{

	constructor(x,y,vector,speed,damage){

		this.x = x
		this.y = y
		this.damage = damage
		this.vector = vector // movement vector = {x: xmove, y: ymove}
		this.speed = speed// should be very small (pixels per frame)
	}

	move(){
		this.x = this.x + this.speed*this.vector.x
		this.y = this.y + this.speed*this.vector.y
	}

	hit(){
		//TODO
	}

	update(){
		this.move()
		//TODO
	}

}