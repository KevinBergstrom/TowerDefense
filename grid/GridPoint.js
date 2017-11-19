class GridPoint {
  constructor (x, y) {
    this.x = x
    this.y = y

    //collision detection optimizing variables
    this.enemies = []
    this.hasPath = false
  }
  set (occupant) {
    this.occupant = occupant
  }
  getOccupant () {
    return this.occupant
  }
  getX () {
    return this.x
  }
  getY () {
    return this.y
  }
  // Checks if occupant exists or not, returns true || false
  isOccupied () {
    return this.occupant ? true : false
  }
}