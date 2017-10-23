
const game = new Phaser.Game(
  800,
  600,
  Phaser.AUTO,
  'Tower Defense',
  { preload, create, update }
)

let spriteSheet
let testTower
const playerTowers = []
const enemies = []
let id = 0
let mouseWasDown = false
let panel

function preload() {
  // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
  slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
  slickUI.load('assets/ui/kenney-theme/kenney.json'); // Use the path to your kenney.json. This is the file that defines your theme.

  game.load.image('testTower', 'assets/images/tiles/towerDefense_tile226.png')
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  slickUI.add(panel = new SlickUI.Element.Panel(8, game.height - 158, game.width - 16, 150));

}

function update() {
  playerTowers.forEach(tower => {
    tower.update(game, enemies)
  })
  // enemies.forEach(enemy => {
  //   enemy.update(game)
  // })

  // Drop tower on mouse click
  if (game.input.activePointer.isDown && !mouseWasDown && isAbovePanel()) {
    dropNewTower('testTower', game.input.mousePointer.x, game.input.mousePointer.y)
  }

  // Update mouse state
  mouseWasDown = game.input.activePointer.isDown
}

function dropNewTower(towerType, x, y) {
  const newTower = game.add.sprite(x, y, towerType)
  newTower.pivot.x = 64
  newTower.pivot.y = 64
  newTower.scale.setTo(0.3, 0.3)
  playerTowers.push(new Tower(game, newTower, { x, y }))
}

function isAbovePanel() {
  return game.input.mousePointer.y < panel.y
}