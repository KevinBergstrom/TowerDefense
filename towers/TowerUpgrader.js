class TowerUpgrader {


	constructor(){//slickUI){
		//this.slickUI = slickUI
		this.tower = null			// this.tower gets set when upgradeTower() is called
		// this.gridPoint = null	// this is a bit of a scechy way of doing things,
									// but it should be fine so long as we refrane from 
									// calling these methodes from anywhere else 
		this.highRange = 600
		this.mediumRange = 300
		this.lowRange = 150

		this.highDmg = 400
		this.mediumDmg = 200
		this.lowDmg = 100

		this.highFR = 100
		this.mediumFR = 60
		this.lowFR = 25
		this.madFR = 1
	}	

	upgradeTower (tower) {
		//
		this.tower = tower
		console.log(tower.phaserRef)
		// this.getGridPoint()

		this.infoPopup()
	}

	getTower (x, y) {
		var towerPoint = model.grid.getPoint(x, y)
		return towerPoint.getOccupant()
	}

	getGridPoint () {
		var x = this.tower.pos.x
		var y = this.tower.pos.y

		console.log(x)
		console.log(y)

		this.gridPoint = model.grid.getPoint(x,y)
	}

	getPrice () {
		return (this.tower.level+1)*40
	}

	infoPopup () {//TODO
		if (this.popup) {
			return
		}
		const popup = new SlickUI.Element.Panel(this.tower.phaserRef.x, this.tower.phaserRef.y - 116, 150, 100)
		this.popup = popup
		slickUI.add(popup)

		const cancelBtn = new SlickUI.Element.Button(77, 60, 64, 32)
		popup.add(cancelBtn)
		cancelBtn.add(new SlickUI.Element.Text(0, 0, "Close"))
		cancelBtn.events.onInputUp.add(this.clearPopup, this)

		const rmBtn = new SlickUI.Element.Button(0, 30, 150, 32)
		popup.add(rmBtn)
		rmBtn.add(new SlickUI.Element.Text(4, 0, "Remove"))
		rmBtn.events.onInputUp.add(this.removeTower, this)

		if(this.tower.level < 2){
			const upgradeBtn = new SlickUI.Element.Button(0, 0, 150, 32)
			popup.add(upgradeBtn)
			upgradeBtn.add(new SlickUI.Element.Text(4, 0, "Upgrade: "+this.getPrice()))
			upgradeBtn.events.onInputUp.add(this.upgrade, this)
		}
		
	}

	// upgrade () {
	// 	var x = this.tower.pos.x
	// 	var y = this.tower.pos.y
	// 	const sprite = this.tower.phaserRef
	// 	// if (this.tower.interval > 40 && model.moneyCheck(40)) {
	// 	// 	this.tower.interval = 1
	// 	// 	model.changeMoney(-40)
	// 	// }

	// 	this.tower.range += 100

	// 	// sprite.loadTexture('missileTower')
	// 	sprite.loadTexture('missileTower')
	// 	this.tower.projectil = 'smallRock'


	// 	this.clearPopup()
	// }

	upgrade () {
		
		console.log(this.tower.type)
		console.log(this.tower.level)
		var price = this.getPrice()

		if (this.tower.type == 'missileTower'){
			if (this.tower.level == 0){
				this.makeMissleTowerLvl2(this.tower)
			}
			else if (this.tower.level == 1){
				this.makeMissleTowerLvl3(this.tower)
			}
			else {
				console.log('ERROR: unexpected tower level')
				return
			}
		}
		else if (this.tower.type == 'defaultTower'){
			if (this.tower.level == 0){
				this.makeDefaultTowerLvl2(this.tower)
			}
			else if (this.tower.level == 1){
				this.makeDefaultTowerLvl3(this.tower)
			}
			else {
				console.log('ERROR: unexpected tower level')
				return
			}
		}
		else {
			console.log('ERROR: unexpected tower type')
			return
		}
		model.changeMoney(-price)
		this.clearPopup()
	}


	// dublecate code, phaser wouldn't let me use the below methods
	makeMissleTowerLvl2 (tower) {
		tower.phaserRef.loadTexture('missileTowerLvl2')
		tower.projectil = 'missile'

		tower.range = this.mediumRange
		tower.damage = this.mediumDmg
		tower.interval = this.highFR
		tower.level = 1
	}

	makeMissleTowerLvl3 (tower) {
		tower.phaserRef.loadTexture('missileTowerLvl3')
		tower.projectil = 'smallRock'

		tower.range = this.highRange
		tower.damage = this.highDmg
		tower.interval = this.mediumFR
		tower.level = 2
	}

	makeDefaultTowerLvl2 (tower) {
		tower.phaserRef.loadTexture('defaultTowerLvl2')
		tower.projectil = 'lazer'

		tower.range = this.lowRange
		tower.damage = this.lowDmg
		tower.interval = this.lowFR
		tower.level = 1
	}

	makeDefaultTowerLvl3 (tower) {
		tower.phaserRef.loadTexture('defaultTowerLvl3')
		tower.projectil = 'lazer'

		tower.range = this.lowRange
		tower.damage = this.lowDmg
		tower.interval = this.madFR
		tower.level = 2
	}

	removeTower () {

		// DOTO: make this work

		// var x = this.tower.pos.x
		// var y = this.tower.pos.y

		// gp = new GridPoint(x, y)
		// grid.setPoint(pg, x, y)
	}

	clearPopup () {

		this.popup.destroy()
		this.popup = null
	}
}