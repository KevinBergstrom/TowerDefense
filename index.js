
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
const enemies = []
let id = 0
let mouseWasDown = false
let panel     // Player UI panel
let grid      // Map grid
let background
let dropTowerState = false  // Determines if player is in the process of dropping a new tower
let hoveringTower           // Temporary tower attached to cursor while purchasing new tower
let towerPurchaseOptions = [] // Tower purchase buttons on player panel


function preload() {
  // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
  slickUI = game.plugins.add(Phaser.Plugin.SlickUI)
  slickUI.load('assets/ui/kenney-theme/kenney.json') // Use the path to your kenney.json. This is the file that defines your theme.

  // Load images into cache
  game.load.image('defaultTower', 'assets/images/tiles/towerDefense_tile226.png')
  game.load.image('missileTower', 'assets/images/tiles/towerDefense_tile204.png')
  game.load.image('background', 'assets/images/background.png')
}

function create() {
  // Start phaser arcade physics engine
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // Add background to canvas
  background = game.add.tileSprite(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'background')

  const panelX = 8
  const panelY = game.height - 158

  panel = new SlickUI.Element.Panel(panelX, panelY, game.width - 16, 150)
  slickUI.add(panel)

  addTowerBuyOption(panel, 'defaultTower')
  addTowerBuyOption(panel, 'missileTower')

  // Instantiate grid
  grid = new Grid(game, Grid.createGrid(GRID_SIZE, panel))
}

function update() {
  playerTowers.forEach(tower => {
    tower.update(game, enemies)
  })

  if (dropTowerState) {
    dropTowerUpdate()
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
    dropNewTower(hoveringTower.key, closestPoint.getX(), closestPoint.getY())
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

function dropNewTower(towerType, x, y) {
  // Add a new tower sprite to the game
  const towerSprite = game.add.sprite(x, y, towerType)
  // towerSprite.anchor.x = 0.5
  // towerSprite.anchor.y = 0.5
  // Offset the sprite to center it
  towerSprite.pivot.x = 64
  towerSprite.pivot.y = 64
  // Scale the sprite to proper size
  towerSprite.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  // Create new tower
  const tower = new Tower(game, towerSprite, { x, y })
  // Add to player's towers
  playerTowers.push(tower)
  exitDropTowerState()
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
