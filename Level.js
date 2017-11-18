class Level{

	static level1(playerUI,backgroundPanel){

		let s = 'spawn'
		let b = 'base'

		const backgroundImage = 'background'
		const tiles = [null,'rock','smallRock','grass']
		
		const map = [
		0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,
		0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,
		0,2,0,0,0,0,1,1,0,0,0,0,0,0,0,0,
		0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,
		0,0,0,0,2,0,0,0,3,0,0,3,0,0,0,0,
		0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,
		s,0,2,0,0,0,0,0,3,0,0,3,0,0,0,b,
		0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
		2,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,
		0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,
		0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0 ]

		backgroundPanel.loadTexture(backgroundImage,0)

		let grid = new Grid(Grid.createGrid(GRID_SIZE, playerUI))
		//TODO player class goes here
		let model = new Model(grid)//,player)

		Level.generateTerrain(map,tiles,model,grid)

		return model

	}

	static generateTerrain(map,tiles,model,grid){
		for(var x = 0;x<GRID_SIZE;x++){
			for(var y = 0;y<GRID_SIZE;y++){

				let gridSpot = grid.getPoint(x,y)
				let mapSpot = map[x+(y*GRID_SIZE)]

				if(mapSpot == 'spawn'){
					model.dropNewSpawn('enemySpawn', grid.getPoint(x,y))
				}else if(mapSpot == 'base'){
					model.dropNewBase('base', grid.getPoint(x,y))
				}else if(mapSpot != 0){
					model.dropNewWall(tiles[mapSpot], grid.getPoint(x,y))
				}
			}
		}
	}

}