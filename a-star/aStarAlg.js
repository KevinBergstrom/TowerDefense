class aStarAlg {
  
  static shortestPath(startNode){
    //takes the start node of the graph made by the grid class
    //returns an array of tuples {x,y} if a path is found
    //returns null if no path is found
    
    let PQueue = new PriorityQueue()
    
    startNode.setDistanceToNode(0)
    PQueue.push(startNode)
    
    let endNode
    let currentNode
    
    while(endNode===undefined && PQueue.size!==0){
      currentNode = PQueue.poll()
      let nextPath

      while(currentNode.paths.length!==0){
        
        nextPath = currentNode.paths.pop()
        
        let nextNode = nextPath.getNextNode()
        let distanceToNode = nextPath.getWeight() + currentNode.getDistanceToNode()
        
        if(nextNode.getDistanceToNode()>distanceToNode){
          nextNode.setDistanceToNode(distanceToNode)
          nextNode.setPreviousNode(currentNode)
        }
        
        PQueue.push(nextNode)
        
        if(nextNode.end){
          endNode = nextNode
        }
        
      }
      
    }
    
    if(endNode===undefined){
      //no path found
      return null;
    }else{
      //create a stack that backtracks starting from the endNode to the startNode
      let Stack = []
      currentNode = endNode
      
      while(currentNode!==undefined){
        Stack.push(currentNode)
        currentNode = currentNode.getPreviousNode()
      }
      //create an array that stores a tuple{x,y} of the path starting from the startNode and ending on the endNode
      let Path = []
      currentNode = Stack.pop()
      
      while(currentNode!==undefined){
        Path.push(currentNode.getCoords())
        currentNode = Stack.pop()
      }
      return Path
    }
    
  }
  
}
