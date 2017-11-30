class TowerUpgrader {


	constructor(){//slickUI){
		//this.slickUI = slickUI
		this.tower = null			// this.tower gets set when upgradeTower() is called
		// this.gridPoint = null	// this is a bit of a scetchy way of doing things,
									// but it should be fine so long as we refrain from 
									// calling these methods from anywhere else 
		this.highRange = 450
		this.mediumRange = 300
		this.lowRange = 150

		this.highDmg = 105
		this.mediumDmg = 70
		this.lowDmg = 35

		this.highFR = 100
		this.mediumFR = 60
		this.lowFR = 20
	}	

	upgradeTower (tower) {
		//
		this.tower = tower
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


		this.gridPoint = model.grid.getPoint(x,y)
		//this is wrong btw
	}

	getPrice () {
		return (this.tower.level+1)*50
	}

	infoPopup () {//TODO
		if (this.popup) {
			return
		}

		let xPos = this.tower.phaserRef.x
		let yPos = this.tower.phaserRef.y - 116

		if(xPos<0){
			xPos = 0
		}
		if(yPos<0){
			yPos = 0
		}
		if(xPos>CANVAS_WIDTH-150){
			xPos = CANVAS_WIDTH-150
		}

		const popup = new SlickUI.Element.Panel(xPos, yPos, 150, 100)
		this.popup = popup
		slickUI.add(popup)

		const cancelBtn = new SlickUI.Element.Button(77, 60, 64, 32)
		popup.add(cancelBtn)
		cancelBtn.add(new SlickUI.Element.Text(0, 0, "Close"))
		cancelBtn.events.onInputUp.add(this.clearPopup, this)

		const rmBtn = new SlickUI.Element.Button(0, 30, 150, 32)
		popup.add(rmBtn)
		rmBtn.add(new SlickUI.Element.Text(4, 0, `Sell: ${this.tower.investment / 2}`))

		rmBtn.events.onInputUp.add(this.removeTower, this)

		if(this.tower.level < 2){
			const upgradeBtn = new SlickUI.Element.Button(0, 0, 150, 32)
			popup.add(upgradeBtn)
			upgradeBtn.add(new SlickUI.Element.Text(4, 0, "Upgrade:"+this.getPrice()))
			upgradeBtn.events.onInputUp.add(this.upgrade, this)
		}
		
	}

	upgrade () {
		
		var price = this.getPrice()

		if(model.moneyCheck(price)){
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
			this.tower.generateInRange(model.grid)
			soundPlayer.play('upgrade')
			this.tower.invest(price)
			model.changeMoney(-price)
			this.clearPopup()
		}
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
		tower.interval = this.lowFR
		tower.level = 2
	}

	removeTower () {
		model.changeMoney(this.tower.investment / 2)
		model.removeTower(this.tower.gridPoint,model.playerTowers)
		this.clearPopup()
		// Remove tower from grid and rerun A*
		// destroy phaser reference
	}

	clearPopup () {
		this.popup.destroy()
		this.popup = null
	}
}

