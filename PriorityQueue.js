class PriorityQueue{
  
  constructor(){
    this.Queue = []
    this.size = 0
  }
  
  push(object){
    for(i = 0;i<this.size;i++){
      
      let currentObject = this.Queue[i]
      if(object.compareTo(currentObject)<0){
        this.Queue.splice(i,object)
        this.size++
        return
      }
      
    }
    this.Queue.push(object)
    this.size++
    return
  }
  
  poll(){
    //returns the first element in the queue
    this.size--
    return this.Queue.shift()
  }
  
}
