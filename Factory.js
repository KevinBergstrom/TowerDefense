class Factory{
	
	constructor(){//slickUI){
		//this.slickUI = slickUI
	}

	initialize(){
		// Load images into cachegame.load.image('missile', 'assets/images/tiles/towerDefense_tile251.png')

	game.load.image('defaultTower', 'assets/images/tiles/towerDefense_tile249.png')
	game.load.image('defaultTowerLvl2', 'assets/images/tiles/towerDefense_tile249.png') // change path
	game.load.image('defaultTowerLvl3', 'assets/images/tiles/towerDefense_tile249.png') // change path
    game.load.image('missileTower', 'assets/images/tiles/towerDefense_tile250.png')
    game.load.image('missileTowerLvl2', 'assets/images/tiles/towerDefense_tile250.png') // change path
    game.load.image('missileTowerLvl3', 'assets/images/tiles/towerDefense_tile250.png') // change path
    game.load.image('background', 'assets/images/background.png')
    game.load.image('enemySpawn', 'assets/images/newSpawner.png')
    game.load.image('base', 'assets/images/newBase.png')
    game.load.image('enemy', 'assets/images/tiles/towerDefense_tile247.png')
    game.load.image('rock', 'assets/images/tiles/towerDefense_tile136.png')
    game.load.image('grass', 'assets/images/tiles/towerDefense_tile130.png')
    game.load.image('smallRock', 'assets/images/tiles/towerDefense_tile137.png')
    game.load.image('missile', 'assets/images/tiles/towerDefense_tile251.png')
    game.load.image('lazer', 'assets/images/tiles/towerDefense_tile297.png')
    game.load.image('dirtBackground', 'assets/images/dirtBackground.png')
    game.load.image('stoneBackground', 'assets/images/stoneBackground.png')
    game.load.image('sandBackground', 'assets/images/sandBackground.png')
    game.load.image('dirtWall', 'assets/images/dirtWallTile.png')
    game.load.image('stoneWall', 'assets/images/stoneWallTile.png')
    game.load.image('sandWall', 'assets/images/sandWallTile.png')
    game.load.image('water', 'assets/images/waterTile.png')
    game.load.image('smallGrass', 'assets/images/tiles/towerDefense_tile131.png')

	}

	loadLevel(levelName,playerUI,backgroundPanel){
		//creates the model for the level
		//uses the class names of the levels from the model
		return Level[levelName](playerUI,backgroundPanel)
	}

	createButton(x,y,width,height,text,playerUI){
		let button = new SlickUI.Element.Button(x, y, width, height)
		playerUI.add(button)
		button.add(new SlickUI.Element.Text(0, 0, text))
		return button
	}

	createRadioButton(x,y,UI){
		let button = new SlickUI.Element.Checkbox(x,y, SlickUI.Element.Checkbox.TYPE_RADIO)
		UI.add(button)
		return button
	}

	createText(x,y,text,playerUI){
		let label = new SlickUI.Element.Text(x, y, text)
		playerUI.add(label)
		return label
	}

	createSprite(image,x,y){
		// Add a new sprite to the game
		const sprite = game.add.sprite(x, y, image)
	    // Offset the sprite to center it
	    sprite.pivot.x = 64
	    sprite.pivot.y = 64
	    // Scale the sprite to proper size
	    sprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
	    
	    return sprite
	}

	createProjectile(image,x,y,vector,speed,damage){
	    const sprite = this.createSprite(image,x,y)

		return new Projectile(sprite,x,y,vector,speed,damage)
	}

	createEnemy(image, x, y, health, speed, damage, path, visible){
	    const sprite = this.createSprite(image,x,y)
	    sprite.visible = visible

	    return new Enemy(sprite, x, y, health, speed, damage, path)
	}

	createTower(image, x, y, range, cost){
	    const sprite = this.createSprite(image,x,y)
	    
	    return new Tower(sprite, image, {x,y}, range, cost)
	}

	createWall(image,x,y){
	    const sprite = this.createSprite(image,x,y)

		return new Wall(sprite, x, y)
	}

	createEnemySpawn(image,x,y,interval){
	    const sprite = this.createSprite(image,x,y)

		return new EnemySpawn(sprite , x, y, interval ) 
	}

	createBase(image,x,y){
	    const sprite = this.createSprite(image,x,y)
	    
		return new Base(sprite, x, y)
	}

	/*createText(x,y,text){
		return new SlickUI.Element.Text(x, y, text)
	}*/

}

