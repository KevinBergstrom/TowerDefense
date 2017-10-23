
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 650
const TOWER_SCALE = 0.3

const game = new Phaser.Game(
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  Phaser.AUTO,
  'TowerDefense',
  { preload, create, update }
)
 
let spriteSheet
let defaultTower
const playerTowers = []
const enemies = []
let id = 0
let mouseWasDown = false
let panel
let grid
let background
let dropTowerState = false
let hoveringTower

function preload() {
  // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
  slickUI = game.plugins.add(Phaser.Plugin.SlickUI)
  slickUI.load('assets/ui/kenney-theme/kenney.json') // Use the path to your kenney.json. This is the file that defines your theme.

  game.load.image('defaultTower', 'assets/images/tiles/towerDefense_tile226.png')
  game.load.image('background', 'assets/images/background.png')
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)

  background = game.add.tileSprite(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'background')

  const panelX = 8
  const panelY = game.height - 158

  panel = new SlickUI.Element.Panel(panelX, panelY, game.width - 16, 150)

  const defaultTowerButton = new SlickUI.Element.Button(panelX + 4, panelY + 4, 140, 140)
  slickUI.add(panel)
  slickUI.add(defaultTowerButton)

  defaultTowerButton.events.onInputUp.add(() => enterDropTowerState('defaultTower'))
  defaultTowerButton.add(new SlickUI.Element.DisplayObject(4, 4, game.make.sprite(0, 0, 'defaultTower')))

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

function dropTowerUpdate() {
  const mouseX = game.input.mousePointer.x
  const mouseY = game.input.mousePointer.y
  hoveringTower.x = mouseX
  hoveringTower.y = mouseY
  if (game.input.activePointer.isDown && !mouseWasDown && isAbovePanel()) {
    dropNewTower(hoveringTower.key, mouseX, mouseY)
  }
}

function enterDropTowerState(towerType) {
  dropTowerState = true
  hoveringTower = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, towerType)
  hoveringTower.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  hoveringTower.pivot.x = 64
  hoveringTower.pivot.y = 64
}

function exitDropTowerState() {
  hoveringTower.kill()
  dropTowerState = false
  hoveringTower = null
}

function dropNewTower(towerType, x, y) {
  const newTower = game.add.sprite(x, y, towerType)
  newTower.pivot.x = 64
  newTower.pivot.y = 64
  newTower.scale.setTo(TOWER_SCALE, TOWER_SCALE)
  playerTowers.push(new Tower(game, newTower, { x, y }))
  exitDropTowerState()
}

function isAbovePanel() {
  return game.input.mousePointer.y < panel.y - 8
}