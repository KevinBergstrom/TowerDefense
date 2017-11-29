
const CANVAS_WIDTH = 650
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

const towerUpgrader = new TowerUpgrader()
 
let model
let soundPlayer

let spriteSheet

let waveButton
let healthText
let moneyText
let levelText
let enemiesText
//let pauseMessage

let id = 0
let mouseWasDown = false
let background
let dropTowerState = false  // Determines if player is in the process of dropping a new tower
let hoveringTower           // Temporary tower attached to cursor while purchasing new tower
let towerPurchaseOptions = [] // Tower purchase buttons on player panel

let panel     // Player UI panel
let levelSelectUI
let menuUI
let pauseMenu
let gameOverMenu // TODO


function preload() {
  // You can use your own methods of making the plugin publicly available. Setting it as a global variable is the easiest solution.
  slickUI = game.plugins.add(Phaser.Plugin.SlickUI)
  slickUI.load('assets/ui/kenney-theme/kenney.json') // Use the path to your kenney.json. This is the file that defines your theme.

  //image loading moved to factory. Thanks and have a nice day

  factory.initialize()

  soundPlayer = new SoundPlayer()
  soundPlayer.load([
      {
        name: 'shoot',
        link: 'assets/sounds/shoot.mp3'
      },
      {
        name: 'explosion',
        link: 'assets/sounds/explosion.mp3'
      },
      {
        name: 'laser',
        link: 'assets/sounds/laser.mp3'
      },
      {
        name: 'upgrade',
        link: 'assets/sounds/upgrade.mp3'
      },
      {
        name: 'win',
        link: 'assets/sounds/win.mp3'
      },
      {
        name: 'background',
        link: 'assets/sounds/background.mp3'
      }
    ])
  game.time.advancedTiming = true
}

function create() {
  // Start phaser arcade physics engine
  game.physics.startSystem(Phaser.Physics.ARCADE)
  // Add background to canvas //create it with level1 class?
  background = game.add.tileSprite(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'background')
  soundPlayer.cache()
  soundPlayer.background.loopFull(0.3)

  openPanel()
  closePanel()

  //openMenu()//TODO Brian uncomment this and remove openLevelSelect() when you've made the menu
  openLevelSelect()

}

function update() {
  if(model!=null){
    if(!game.paused && !model.gameOver){

      model.update()

      if (dropTowerState) {
        dropTowerUpdate()
      }
      if (model.waveStarted) {
        isWaveComplete()
      }

      updateTextItems()

      // Update mouse state
      mouseWasDown = game.input.activePointer.isDown

      checkIfLost()
    }
  }
  //TESTING
  game.debug.text('fps:' + game.time.fps,50,600,0)

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
  enemiesText.value = "Enemies: " + (model.getEnemies().length + model.grid.enemySpawns.spawnQueue.length)
}

function startNextWave(){
  if(model.waveStarted == false){
    waveButton.visible = false
    //exitDropTowerState()
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

function openPanel(){
  closeMenu()
  closelevelSelect()
  closePauseMenu()
  if(panel==null){
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
  addTowerBuyOption(towerPanel, 'defaultTower', 100)
  addTowerBuyOption(towerPanel, 'missileTower', 100)
  }else{
    panel.visible = true
  }
}

function closePanel(){
  if(panel){
    panel.visible = false
  }
}

function openMenu(){
  closelevelSelect()
  closePanel()
  closePauseMenu()
  if(menuUI==null){
    //TODO make the menu
    //start game
    //difficulty stuff

    //to advance to levelSelect just call openLevelSelect()
    //ex: Button.events.onInputUp.add(() => openLevelSelect())

    //use factory.createButton() or factory.createText()
    //I dont have a create images in factory yet, feel free to add to the factory

  }else{
    menuUI.visible = true
  }
}

function closeMenu(){
  if(menuUI){
    menu.visible = false
  }
}

function openPauseMenu(){
  if(pauseMenu==null){
    //TODO make a pause menu

    //pause message
    //return to menu button
    //resume button?

    //to go back to main menu just call openMenu()

    //here are the old ways its been done
    /*
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
*/
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

  }else{
    pauseMenu.visible = true
  }
}

function closePauseMenu(){
  if(pauseMenu){
    pauseMenu.visible = false
  }
}

function openLevelSelect(){
  closeMenu()
  closePanel()
  closePauseMenu()
  if(levelSelectUI==null){
    levelSelectUI = new SlickUI.Element.Panel(0, 0, game.width, game.height)
    //let loseMessage = new SlickUI.Element.Text((CANVAS_WIDTH-100)/2, CANVAS_HEIGHT/2, "GAME OVER\n SCORE "+model.wave)
    slickUI.add(levelSelectUI)

    let levels = Object.getOwnPropertyNames(Level)

    let numOfLevels = levels.length

    for(var i = 0; i <numOfLevels;i++){
      if(levels[i].search('level')==-1){
        levels.splice(i,1)
        i--
        numOfLevels--
      }
    }

    let xPos = 50
    let yPos = 0
    for(var j = 0; j <levels.length;j++){

      yPos += 50

      if(yPos > CANVAS_HEIGHT-100){
        yPos = 50
        xPos += (CANVAS_WIDTH-100)/4
      }

      let lvlbutton = factory.createButton(xPos,yPos,(CANVAS_WIDTH-100)/4,50,levels[j],levelSelectUI)
      let levelName = levels[j].toString()
      lvlbutton.events.onInputUp.add(() => changeLevel(levelName))
    }

    let backButton = factory.createButton(CANVAS_WIDTH-100,CANVAS_HEIGHT-50,100,50,'Back',levelSelectUI)
    backButton.events.onInputUp.add(() => openMenu())

    let levelSelectText = factory.createText((CANVAS_WIDTH/2)-75,10,'Level Select',levelSelectUI)

  }else{
    levelSelectUI.visible = true
  }
}

function closelevelSelect(){
  if(levelSelectUI){
    levelSelectUI.visible = false
  }
}

function changeLevel(levelName){
  if(model!=null){
    model.killAllSprites()//maybe overkill?
    model = null
  }
  openPanel()
  model = factory.loadLevel(levelName,panel,background)
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
    if(!closestPoint.isOccupied()&&closestPoint.enemies.length==0){

      closestPoint.set('tempOccupant')
      closestPoint.node.setObstruction()

      newPath = model.grid.findShortestPath(model.getEnemySpawns().x,model.getEnemySpawns().y,model.getPlayerBases().x,model.getPlayerBases().y)

      if(newPath !== null){
        if(model.waveStarted){

          if(model.findDivergentPaths(newPath)==true){
            model.dropNewTower(hoveringTower.key, closestPoint)
            model.playerTowers.forEach(tower => {
              tower.generateInRange(model.grid)
            })
          }else{
            closestPoint.set(null)
            closestPoint.node.rescindObstruction()
            exitDropTowerState()

          }

        }else{
          model.dropNewTower(hoveringTower.key, closestPoint)
          model.grid.setPath(newPath)
        }

      }else{
        closestPoint.set(null)
        closestPoint.node.rescindObstruction()
        exitDropTowerState()
      }

    }else{
      exitDropTowerState()
    }
  }
}

//TODO move to model
function removeTower(gridPoint){
  gridPoint.setOccupant(null)
  gridPoint.node.rescindObstruction()

  newPath = model.grid.findShortestPath(model.getEnemySpawns().x,model.getEnemySpawns().y,model.getPlayerBases().x,model.getPlayerBases().y)
  model.findDivergentPaths(newPath)

  model.playerTowers.forEach(tower => {
    tower.generateInRange(model.grid)
  })

}

function enterDropTowerState(towerType) {
  if (model.moneyCheck(100)) {
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
