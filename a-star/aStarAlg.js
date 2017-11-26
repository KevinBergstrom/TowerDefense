class aStarAlg {
  
  static shortestPath(startNode,finalNode){
    //takes the start node and final node of the graph made by the grid class
    //returns an array of tuples {x,y} if a path is found
    //returns null if no path is found
    
    let PQueue = new PriorityQueue()
    
    startNode.setDistanceToNode(0)
    startNode.setHeuristic(finalNode.x,finalNode.y)
    PQueue.push(startNode)
    
    let endNode
    let currentNode
    let changedNodes = [startNode]
    
    while(endNode==null && PQueue.size>0){
      currentNode = PQueue.poll()
      let nextPath

      if(currentNode.end){
        endNode = currentNode
        currentNode.visited = true
      }

      if(!currentNode.visited){

        currentNode.visited = true
        let currentPaths = currentNode.paths.slice()

        //let b = factory.createEnemy('enemy', currentNode.x, currentNode.y, 1, 1, 1, null, true)

        while(currentPaths.length>0){
          
          nextPath = currentPaths.pop()
          
          let nextNode = nextPath.getNextNode()

          if(!nextNode.obstruction){

            if(nextNode.getHeuristic()==null){
              nextNode.setHeuristic(finalNode.x,finalNode.y)
              changedNodes.push(nextNode)
            }

            let distanceToNode = nextPath.getWeight() + currentNode.getDistanceToNode()
            
            if(nextNode.getDistanceToNode()>distanceToNode){
              nextNode.setDistanceToNode(distanceToNode)
              nextNode.setPreviousNode(currentNode)
            }
            
            PQueue.push(nextNode)
            
          }
        }
      }
    }

    if(endNode===undefined){
      //no path found

       changedNodes.forEach(node => {
          node.reset()
        })

      return null;
    }else{
      //create a stack that backtracks starting from the endNode to the startNode
      let Stack = []
      currentNode = endNode
      
      while(currentNode!=null){
        Stack.push(currentNode)
        currentNode = currentNode.getPreviousNode()
      }
      //create an array that stores a tuple{x,y} of the path starting from the startNode and ending on the endNode
      let Path = []
      currentNode = Stack.pop()
      
      while(currentNode!=null){
        Path.push(currentNode.getCoords())
        currentNode = Stack.pop()
      }

      changedNodes.forEach(node => {
        node.reset()
      })

      return Path
    }
    
  }
  
}
