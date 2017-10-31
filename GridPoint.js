class GridPoint {
  constructor (x, y) {
    this.x = x
    this.y = y
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
  isOccupied () {
    return this.occupant ? true : false
  }
}