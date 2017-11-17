class Factory{
	
	constructor(){//slickUI){
		//this.slickUI = slickUI
	}

	initialize(){
		// Load images into cachegame.load.image('missile', 'assets/images/tiles/towerDefense_tile251.png')

	game.load.image('defaultTower', 'assets/images/tiles/towerDefense_tile249.png')
    game.load.image('missileTower', 'assets/images/tiles/towerDefense_tile250.png')
    game.load.image('upgradedTower', 'assets/images/tiles/towerDefense_tile291.png')
    game.load.image('background', 'assets/images/background.png')
    game.load.image('enemySpawn', 'assets/images/newSpawner.png')
    game.load.image('base', 'assets/images/newBase.png')
    game.load.image('enemy', 'assets/images/tiles/towerDefense_tile247.png')
    game.load.image('rock', 'assets/images/tiles/towerDefense_tile136.png')
    game.load.image('grass', 'assets/images/tiles/towerDefense_tile130.png')
    game.load.image('smallRock', 'assets/images/tiles/towerDefense_tile137.png')
    game.load.image('missile', 'assets/images/tiles/towerDefense_tile251.png')

	}

	createModel(gridSize,playerUI){
		let grid = new Grid(Grid.createGrid(gridSize, playerUI))
		return new Model(grid)
	}

	createProjectile(image,x,y,vector,speed,damage){

		// Add a new sprite to the game
	    const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)

		return new Projectile(sprite,x,y,vector,speed,damage)
	}

	createEnemy(image, x, y, health, speed, damage, path, visible){
		// Add a new sprite to the game
	    const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
	    sprite.visible = visible

	    return new Enemy(sprite, x, y, health, speed, damage, path)
	}

	createTower(image,x,y){
		// Add a new sprite to the game
	    const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
	    return new Tower(sprite,{x,y})
	}

	createWall(image,x,y){
		// Add a new sprite to the game
	    const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
		return new Wall(sprite, x, y)
	}

	createEnemySpawn(image,x,y,interval){
		// Add a new sprite to the game
	    const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
		return new EnemySpawn(sprite , x, y, interval ) 
	}

	createBase(image,x,y){
		// Add a new sprite to the game
	    const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
		return new Base(sprite, x, y)
	}

	/*createText(x,y,text){
		return new SlickUI.Element.Text(x, y, text)
	}*/

}