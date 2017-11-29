class aStarNode {
  
  constructor(x, y){
    this.x = x
    this.y = y
    this.paths = []
    this.setDistanceToNode(Number.POSITIVE_INFINITY)
    this.obstruction = false
    this.visited = false
  }
  
  addPath(path){
    this.paths.push(path)
  }
  
  setEnd(){
    this.end = true
  }

  setObstruction(){
    this.obstruction = true
  }

  rescindObstruction(){
    this.obstruction = false
  }

  reset(){
    this.setDistanceToNode(Number.POSITIVE_INFINITY)
    this.setPreviousNode(null)
    this.distanceToFinal = null
    this.visited = false
  }
  
  setDistanceToNode(dist){
    this.distanceToNode = dist
  }
  
  setHeuristic(endX, endY){
    //the A* hueristic will be the distance from this node to the end Node
    this.distanceToFinal = Math.sqrt( Math.pow(endX-this.x,2) +Math.pow(endY-this.y,2) )
  }
  
  setPreviousNode(node){
    this.previousNode = node
  }
  
  getDistanceToNode(){
    return this.distanceToNode
  }
  
  getHeuristic(){
    return this.distanceToFinal
  }
  
  getPreviousNode(){
    return this.previousNode
  }
  
  getCoords(){
    //returns a tuple with the x and y coordinates of the node
    return {x: this.x, y: this.y}
  }
  
    compareTo(node){
    if( (this.getDistanceToNode() + this.getHeuristic()) < (node.getDistanceToNode() + node.getHeuristic()) ){
      return -1 //less than node
    }else if( (this.getDistanceToNode() + this.getHeuristic()) > (node.getDistanceToNode() + node.getHeuristic()) ){
      return 1 //greater than node
    }
    return 0 //equal to node
  }
}

module.exports = aStarNode
