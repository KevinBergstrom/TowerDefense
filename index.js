
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 650
const TOWER_SCALE = 0.3
const PURCHASE_BUTTON_SIZE = 140
const GRID_SIZE = 16

const game = new Phaser.Game(
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  Phaser.AUTO,
  'TowerDefense',
  { preload, create, update }
)
 
let spriteSheet
const playerTowers = []
const enemies = [] //should we put these in the grid class? is this the controller class?
const projectiles = []

let waveButton
let healthText
let moneyText
let levelText
let enemiesText

let id = 0
let mouseWasDown = false
let panel     // Player UI panel
let grid      // Map grid
let background
let dropTowerState = false  // Determines if player is in the process of dropping a new tower
let hoveringTower           // Temporary tower attached to cursor while purchasing new tower
let towerPurchaseOptions = [] // Tower purchase buttons on player panel
let waveStarted = false //TODO integrate this
let money = 1000
let health = 100
let wave = 0

function preload() {
  // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
  slickUI = game.plugins.add(Phaser.Plugin.SlickUI)
  slickUI.load('assets/ui/kenney-theme/kenney.json') // Use the path to your kenney.json. This is the file that defines your theme.

  // Load images into cache
  game.load.image('defaultTower', 'assets/images/tiles/towerDefense_tile226.png')
  game.load.image('missileTower', 'assets/images/tiles/towerDefense_tile204.png')
  game.load.image('background', 'assets/images/background.png')
  game.load.image('enemySpawn', 'assets/images/tiles/towerDefense_tile270.png')
  game.load.image('base', 'assets/images/tiles/towerDefense_tile181.png')
  game.load.image('enemy', 'assets/images/tiles/towerDefense_tile247.png')
  game.load.image('rock', 'assets/images/tiles/towerDefense_tile136.png')
  game.load.image('grass', 'assets/images/tiles/towerDefense_tile130.png')
  game.load.image('smallRock', 'assets/images/tiles/towerDefense_tile137.png')
  game.load.image('missile', 'assets/images/tiles/towerDefense_tile251.png')
}

function create() {
  // Start phaser arcade physics engine
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // Add background to canvas
  background = game.add.tileSprite(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'background')

  const panelX = 0
  const panelY = game.height - 150
  const wavePanelWidth = 150
  const statsPanelWidth = 150

  const statsPanel = new SlickUI.Element.Panel(0, 0, statsPanelWidth, 150)
  const towerPanel = new SlickUI.Element.Panel(statsPanel._width, 0, game.width - statsPanelWidth - wavePanelWidth, 150)
  const wavePanel = new SlickUI.Element.Panel(statsPanelWidth + towerPanel._width, 0, wavePanelWidth, 150) 

  panel = new SlickUI.Element.Panel(panelX, panelY, game.width, 150)
  slickUI.add(panel)
  panel.add(statsPanel)
  panel.add(towerPanel)
  panel.add(wavePanel)

  healthText = new SlickUI.Element.Text(4, 0, "Health: " + health)
  moneyText = new SlickUI.Element.Text(4, 32, "Money: " + money)
  levelText = new SlickUI.Element.Text(4, 0, "Wave: " + wave)
  enemiesText = new SlickUI.Element.Text(4, 32, "Enemies: " + enemies.length)

  statsPanel.add(healthText)
  statsPanel.add(moneyText)
  wavePanel.add(levelText)
  wavePanel.add(enemiesText)

  waveButton = new SlickUI.Element.Button(0, wavePanel._height - 60, wavePanelWidth, 32)
  wavePanel.add(waveButton)
  waveButton.add(new SlickUI.Element.Text(8, 0, "Next wave"));
  waveButton.events.onInputUp.add(startNextWave);


  addTowerBuyOption(towerPanel, 'defaultTower')
  addTowerBuyOption(towerPanel, 'missileTower')

  // Instantiate grid
  grid = new Grid(game, Grid.createGrid(GRID_SIZE, panel))
  generateTerrain()
  dropNewBase('base', grid.getPoint(15,8))
  dropNewSpawn('enemySpawn', grid.getPoint(0,8))

  //TEST
  //wave = 20
  //startNextWave()

}

function generateTerrain(){//should probably be in grid

  dropNewWall('smallRock', grid.getPoint(1,2))
  dropNewWall('smallRock', grid.getPoint(4,6))
  dropNewWall('smallRock', grid.getPoint(2,11))
  dropNewWall('smallRock', grid.getPoint(0,13))
  dropNewWall('smallRock', grid.getPoint(3,4))
  dropNewWall('smallRock', grid.getPoint(2,8))

  dropNewWall('grass', grid.getPoint(9,5))
  dropNewWall('grass', grid.getPoint(9,9))
  dropNewWall('grass', grid.getPoint(10,5))
  dropNewWall('grass', grid.getPoint(10,9))
  dropNewWall('grass', grid.getPoint(8,6))
  dropNewWall('grass', grid.getPoint(8,7))
  dropNewWall('grass', grid.getPoint(8,8))
  dropNewWall('grass', grid.getPoint(11,6))
  dropNewWall('grass', grid.getPoint(11,7))
  dropNewWall('grass', grid.getPoint(11,8))

  dropNewWall('rock', grid.getPoint(4,0))
  dropNewWall('rock', grid.getPoint(5,0))
  dropNewWall('rock', grid.getPoint(6,0))
  dropNewWall('rock', grid.getPoint(7,0))
  dropNewWall('rock', grid.getPoint(8,0))
  dropNewWall('rock', grid.getPoint(9,0))
  dropNewWall('rock', grid.getPoint(5,1))
  dropNewWall('rock', grid.getPoint(6,1))
  dropNewWall('rock', grid.getPoint(7,1))
  dropNewWall('rock', grid.getPoint(8,1))
  dropNewWall('rock', grid.getPoint(6,2))
  dropNewWall('rock', grid.getPoint(7,2))
  dropNewWall('rock', grid.getPoint(6,3))

  dropNewWall('rock', grid.getPoint(4,15))
  dropNewWall('rock', grid.getPoint(5,15))
  dropNewWall('rock', grid.getPoint(6,15))
  dropNewWall('rock', grid.getPoint(7,15))
  dropNewWall('rock', grid.getPoint(8,15))
  dropNewWall('rock', grid.getPoint(9,15))
  dropNewWall('rock', grid.getPoint(4,14))
  dropNewWall('rock', grid.getPoint(5,14))
  dropNewWall('rock', grid.getPoint(6,14))
  dropNewWall('rock', grid.getPoint(7,14))
  dropNewWall('rock', grid.getPoint(8,14))
  dropNewWall('rock', grid.getPoint(5,13))
  dropNewWall('rock', grid.getPoint(6,13))
  dropNewWall('rock', grid.getPoint(7,13))
  dropNewWall('rock', grid.getPoint(6,12))
  dropNewWall('rock', grid.getPoint(7,12))
  dropNewWall('rock', grid.getPoint(6,11))
}

function startNextWave(){
  if(waveStarted == false){
    waveButton.visible = false
    exitDropTowerState()
    wave = wave + 1
    preWaveSetup()
    waveStarted = true
  }
}

function endWave(){
  if(waveStarted == true){
   //TODO award money for finishing wave maybe?
  waveButton.visible = true
   waveStarted = false
 }
}

function isWaveComplete(){
    if(enemies.length==0 && grid.enemySpawns.finished()==true){
      endWave()
    }
}

function preWaveSetup(){
  let newPath = grid.findShortestPath(grid.enemySpawns.x,grid.enemySpawns.y,grid.playerBases.x,grid.playerBases.y)
  grid.enemySpawns.setPath(newPath)
  grid.enemySpawns.populateSpawnQueue(wave)
}

function updateTextItems(){
  healthText.value = "Health: " + health
  moneyText.value = "Money: " + money
  levelText.value = "Wave: " + wave
  enemiesText.value = "Enemies: " + enemies.length
}

function setMoney(value){
  money = money + value
}

function setHealth(value){
  health = health - value
}

function checkIfLost(){
  if(health<=0){
    //YOU LOSE
    //NOT BIG SUPRISE
  }
}

function update() {
  if (!waveStarted) {
    if (dropTowerState) {
      dropTowerUpdate()
    }
  } else {
    grid.update(enemies,setMoney,setHealth)
    isWaveComplete()
    playerTowers.forEach(tower => {
      tower.update(game, enemies,projectiles)
    })
  }

  projectiles.forEach(proj => {
      proj.update(enemies,projectiles)

  })

  //game.physics.arcade.overlap(projectiles,enemies,enemySpriteCollide, null, this);

  updateTextItems()
  // enemies.forEach(enemy => {
  //   enemy.update(game)
  // })

  // Update mouse state
  mouseWasDown = game.input.activePointer.isDown

  checkIfLost()
}

// Function ran during dropTowerState
function dropTowerUpdate() {
  // Get mouse x and y values
  const mouseX = game.input.mousePointer.x
  const mouseY = game.input.mousePointer.y

  // Find closest grid point
  const closestPoint = grid.getClosestPoint(mouseX, mouseY)

  // Snap hovering tower sprite to mouse position
  hoveringTower.x = closestPoint.getX()
  hoveringTower.y = closestPoint.getY()

  // If the player clicks a valid point, then drop the tower
  if (game.input.activePointer.isDown && !mouseWasDown && isAbovePanel()) {
    if(!closestPoint.isOccupied()){

      closestPoint.set('tempOccupant')
      newPath = grid.findShortestPath(grid.enemySpawns.x,grid.enemySpawns.y,grid.playerBases.x,grid.playerBases.y)
      if(newPath !== null){
        //take your money here?
        dropNewTower(hoveringTower.key, closestPoint)
        grid.setPath(newPath)
      }else{
        closestPoint.set(undefined)
        exitDropTowerState()
      }

    }else{
      exitDropTowerState()
    }
  }
}

function enterDropTowerState(towerType) {
  if(waveStarted == false){
    exitDropTowerState()
    // Let the game know the player is in the process of placing a tower
    dropTowerState = true
    // Attach tower sprite to cursor until placed or canceled
    hoveringTower = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, towerType)
    // Scale down tower size and pivot to center
    hoveringTower.scale.setTo(TOWER_SCALE, TOWER_SCALE)
    hoveringTower.pivot.x = 64
    hoveringTower.pivot.y = 64
  }
}

function exitDropTowerState() {
  // Remove tower sprite from cursor and game process
  if (hoveringTower) {
    hoveringTower.kill()
  }
  dropTowerState = false
  hoveringTower = null
}

function dropNewTower(towerType, gridPoint) {
  //add cost here player.money -= tower.cost
  const x = gridPoint.getX()
  const y = gridPoint.getY()
  // Add a new tower sprite to the game
  const towerSprite = game.add.sprite(x, y, towerType)
  // Offset the sprite to center it
  towerSprite.pivot.x = 64
  towerSprite.pivot.y = 64
  // Scale the sprite to proper size
  towerSprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  // Create new tower
  const tower = new Tower(game, towerSprite, { x, y })  
  // Add to player's towers
  // Occupy gridPoint
  playerTowers.push(tower)
  gridPoint.set(tower)
  exitDropTowerState()
}

function dropNewBase(baseType, gridPoint) {
  const x = gridPoint.getX()
  const y = gridPoint.getY()
  // Add a new base sprite to the game
  const baseSprite = game.add.sprite(x, y, baseType)
  // Offset the sprite to center it
  baseSprite.pivot.x = 64
  baseSprite.pivot.y = 64
  // Scale the sprite to proper size
  baseSprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  // Create new base
  const base = new Base(game, baseSprite , x, y )  
  // Occupy gridPoint
  grid.addBase(base)
  gridPoint.set(base)
}

function dropNewSpawn(spawnType, gridPoint) {
  const interval = 60//one enemy a second
  const x = gridPoint.getX()
  const y = gridPoint.getY()
  // Add a new spawn sprite to the game
  const spawnSprite = game.add.sprite(x, y, spawnType)
  // Offset the sprite to center it
  spawnSprite.pivot.x = 64
  spawnSprite.pivot.y = 64
  // Scale the sprite to proper size
  spawnSprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  // Create new spawn
  const spawn = new EnemySpawn(game, spawnSprite , x, y, interval )  
  // Occupy gridPoint
  grid.addSpawn(spawn)
  gridPoint.set(spawn)
}

function dropNewWall(wallType, gridPoint) {
  const x = gridPoint.getX()
  const y = gridPoint.getY()
  // Add a new wall sprite to the game
  const wallSprite = game.add.sprite(x, y, wallType)
  // Offset the sprite to center it
  wallSprite.pivot.x = 64
  wallSprite.pivot.y = 64
  // Scale the sprite to proper size
  wallSprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  // Create new spawn
  const wall = new Wall(game, wallSprite , x, y)  
  // Occupy gridPoint
  gridPoint.set(wall)
}

// Check if mouse is above player panel
function isAbovePanel() {
  return game.input.mousePointer.y < panel.y - 8
}

// Add a tower button to the player panel
function addTowerBuyOption(panel, towerName, price) {
  const towerButton = new SlickUI.Element.Button(
      (towerPurchaseOptions.length * PURCHASE_BUTTON_SIZE) + 4, 
      4, 
      PURCHASE_BUTTON_SIZE,
      PURCHASE_BUTTON_SIZE)

  panel.add(towerButton)

  towerButton.events.onInputUp.add(() => enterDropTowerState(towerName))
  towerButton.add(new SlickUI.Element.DisplayObject(4, 4, game.make.sprite(0, 0, towerName)))
  towerPurchaseOptions.push(towerButton)
}
