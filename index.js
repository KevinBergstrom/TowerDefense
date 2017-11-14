
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

  statsPanel.add(new SlickUI.Element.Text(4, 0, "Health: "))
  statsPanel.add(new SlickUI.Element.Text(4, 32, "Money: "))

  wavePanel.add(new SlickUI.Element.Text(4, 0, "Level: "))
  wavePanel.add(new SlickUI.Element.Text(4, 32, "Enemies: "))
  const waveButton = new SlickUI.Element.Button(0, wavePanel._height - 60, wavePanelWidth, 32)
  wavePanel.add(waveButton)
  waveButton.add(new SlickUI.Element.Text(8, 0, "Next wave"));

  addTowerBuyOption(towerPanel, 'defaultTower')
  addTowerBuyOption(towerPanel, 'missileTower')

  // Instantiate grid
  grid = new Grid(game, Grid.createGrid(GRID_SIZE, panel))
  grid.generateTerrain()
  dropNewBase('base', grid.getPoint(15,8))
  dropNewSpawn('enemySpawn', grid.getPoint(0,8))
  //grid.addBase()
  //grid.addEnemySpawn()
  //spawn = new EnemySpawn()
  //base = new Base()
}

function update() {
  playerTowers.forEach(tower => {
    tower.update(game, enemies)
  })
  if(waveStarted == false){
    if (dropTowerState) {
      dropTowerUpdate()
    }
  }else{
    grid.update(enemies)
  }
  // enemies.forEach(enemy => {
  //   enemy.update(game)
  // })

  // Update mouse state
  mouseWasDown = game.input.activePointer.isDown
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

function getEnemySprite(x,y){
  // Add a new spawn sprite to the game
  const enemySprite = game.add.sprite(x, y, 'enemy')
  // Offset the sprite to center it
  enemySprite.pivot.x = 64
  enemySprite.pivot.y = 64
  // Scale the sprite to proper size
  enemySprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  return enemySprite
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
