
const game = new Phaser.Game(
  800,
  600,
  Phaser.AUTO,
  'Tower Defense',
  { preload, create, update }
)

let spriteSheet
let testTower

function preload() {
  // spriteSheet = game.load.spritesheet(
  //   'towerdefense',
  //   'assets/images/towerDefense_tilesheet.png',
  //   16,
  //   16,
  //   144
  // )
  game.load.image('testTower', 'assets/images/tiles/towerDefense_tile226.png')
}

function create() {
  testTower = game.add.sprite(16, 16, 'testTower')
  game.physics.startSystem(Phaser.Physics.ARCADE)
}

function update() {}