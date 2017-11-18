
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

const factory = new Factory()
 
let model

let spriteSheet

let waveButton
let healthText
let moneyText
let levelText
let enemiesText
let pauseMessage

let id = 0
let mouseWasDown = false
let panel     // Player UI panel
let background
let dropTowerState = false  // Determines if player is in the process of dropping a new tower
let hoveringTower           // Temporary tower attached to cursor while purchasing new tower
let towerPurchaseOptions = [] // Tower purchase buttons on player panel

function preload() {
  // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
  slickUI = game.plugins.add(Phaser.Plugin.SlickUI)
  slickUI.load('assets/ui/kenney-theme/kenney.json') // Use the path to your kenney.json. This is the file that defines your theme.

  //image loading moved to factory. Thanks and have a nice day

  factory.initialize()

}

function create() {
  // Start phaser arcade physics engine
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // Add background to canvas //create it with level1 class?
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

  healthText = new SlickUI.Element.Text(4, 0, "Health: ")
  moneyText = new SlickUI.Element.Text(4, 32, "Money: ")
  levelText = new SlickUI.Element.Text(4, 0, "Wave: ")
  enemiesText = new SlickUI.Element.Text(4, 32, "Enemies: ")

  statsPanel.add(healthText)
  statsPanel.add(moneyText)
  wavePanel.add(levelText)
  wavePanel.add(enemiesText)

  waveButton = new SlickUI.Element.Button(0, wavePanel._height - 60, wavePanelWidth, 32)
  wavePanel.add(waveButton)
  waveButton.add(new SlickUI.Element.Text(8, 0, "Next wave"));
  waveButton.events.onInputUp.add(startNextWave);

  //update these when tower upgrades is implemented
  addTowerBuyOption(towerPanel, 'defaultTower',100)
  addTowerBuyOption(towerPanel, 'missileTower',100)

  model = factory.loadLevel1(panel,background)

  //TEST
  //wave = 20
  //startNextWave()

//kevin's try at it
//I essentially have a pauseMessage that is invisible unless you pause
  pauseMessage = new SlickUI.Element.Text(CANVAS_WIDTH/2, (CANVAS_HEIGHT-150)/2, "Paused: Press escape to resume")
  slickUI.add(pauseMessage)
  pauseMessage.visible = false
  pauseMessage.x = (CANVAS_WIDTH/2)-(pauseMessage.text.width/2)

   pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC)
   pauseKey.onDown.add(toggleMenu, this)

   function toggleMenu(){
      if (!game.paused) {        
        game.paused = true;
        pauseMessage.visible = true
      } 
      else {
        game.paused = false
        pauseMessage.visible = false
      }

    }

/*

  pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
   pauseKey.onDown.add(toggleMenu, this)

    function toggleMenu(){
      if (!game.paused) {        
        game.paused = true;
        pauseMessage = game.add.text(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 'Paused: Press escape to resume', { font: '30px Arial', fill: '#fff' });
        //pauseMessage.anchor.setTo(0.5, 0.5);
      } 
      else {
        pauseMessage.destroy()
        game.paused = false
      }

    }*/

}

function update() {
  if(model!=null){
    if(!game.paused && !model.gameOver){

      model.update()

      if (!model.waveStarted) {
        if (dropTowerState) {
          dropTowerUpdate()
        }
      } else {
        isWaveComplete()
      }

      updateTextItems()

      // Update mouse state
      mouseWasDown = game.input.activePointer.isDown

      checkIfLost()
    }
  }
}

function clearOldModel(){
  if(model != null){
    model.killAllSprites()
  }
  exitDropTowerState()
  game.paused = false
  pauseMessage.visible = false
}

function updateTextItems(){
  healthText.value = "Health: " + model.getHealth()
  moneyText.value = "Money: " + model.getMoney()
  levelText.value = "Wave: " + model.wave
  enemiesText.value = "Enemies: " + model.getEnemies().length
}

function startNextWave(){
  if(model.waveStarted == false){
    waveButton.visible = false
    exitDropTowerState()
    model.startWave()
  }
}

function endThisWave(){
  if(model.waveStarted == true){
    model.endWave()
    waveButton.visible = true
  }
}

function isWaveComplete(){
    if(model.getEnemies().length==0 && model.spawnQueueEmpty()){
      endThisWave()
    }
}

function checkIfLost(){
  if(model.getHealth()<=0){
    //YOU LOSE
    //NOT BIG SUPRISE
    //TODO probably change this
    gameOver = true
    pauseMessage.visible = false
  let panel = new SlickUI.Element.Panel(0, 0, game.width, game.height)
  let loseMessage = new SlickUI.Element.Text((CANVAS_WIDTH-100)/2, CANVAS_HEIGHT/2, "GAME OVER\n SCORE "+model.wave)

  slickUI.add(panel)
  slickUI.add(loseMessage)
  }
}



// Function ran during dropTowerState
function dropTowerUpdate() {
  // Get mouse x and y values
  const mouseX = game.input.mousePointer.x
  const mouseY = game.input.mousePointer.y

  // Find closest grid point
  const closestPoint = model.grid.getClosestPoint(mouseX, mouseY)

  // Snap hovering tower sprite to mouse position
  hoveringTower.x = closestPoint.getX()
  hoveringTower.y = closestPoint.getY()

  // If the player clicks a valid point, then drop the tower
  if (game.input.activePointer.isDown && !mouseWasDown && isAbovePanel()) {
    if(!closestPoint.isOccupied()){

      closestPoint.set('tempOccupant')
      newPath = model.grid.findShortestPath(model.getEnemySpawns().x,model.getEnemySpawns().y,model.getPlayerBases().x,model.getPlayerBases().y)
      if(newPath !== null){
        model.dropNewTower(hoveringTower.key, closestPoint)
        model.grid.setPath(newPath)
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
  if (!model.waveStarted && model.moneyCheck(100)) {
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

  const towerPrice = new SlickUI.Element.Text(
    (towerPurchaseOptions.length * PURCHASE_BUTTON_SIZE) + 10, 
      6, price)

  panel.add(towerButton)
  panel.add(towerPrice)

  towerButton.events.onInputUp.add(() => enterDropTowerState(towerName))
  towerButton.add(new SlickUI.Element.DisplayObject(4, 4, game.make.sprite(0, 0, towerName)))
  towerPurchaseOptions.push(towerButton)
}
