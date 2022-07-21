class LinkedListNode {
    constructor(value, next = null) {
      this.value = value;
      this.next = next;
    }
  
    stringify() {
      return JSON.stringify(this.value);
    }
  }

class LinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.forEach = this.forEach.bind(this)
    }

    append(value) {
        const newNode = new LinkedListNode(value);
      
        if (!this.head || !this.tail) {
          this.head = newNode;
          this.tail = newNode;
      
          return this;
        }
      
        this.tail.next = newNode;
      
        this.tail = newNode;
      
        return this;
      }

      forEach(callback) {
        let current = this.head;
        while (current) {
          callback(current.value);
          current = current.next;
        }
      }

      delete(value, selector) {
        if (!this.head) {
          return null;
        }
      
        let deletedNode = null;
      
        while (this.head && selector(this.head.value) === value) {
          deletedNode = this.head;
      
          this.head = this.head.next;
        }
      
        let currentNode = this.head;
      
        if (currentNode !== null) {
          while (currentNode.next) {
            if (selector(currentNode.next.value) === value) {
              deletedNode = currentNode.next;
              currentNode.next = currentNode.next.next;
            } else {
              currentNode = currentNode.next;
            }
          }
        }

        
        if (this.tail && selector(this.tail.value) === value) {
          this.tail = currentNode;
        }
      
        return deletedNode;
      }

      find(value, selector) {
        if (!this.head) {
          return null;
        }
      
        let currentNode = this.head;
      
        while (currentNode) {
          if (selector) {
            const valueToFind = selector(currentNode);
            if (value !== undefined && valueToFind === value) {
              return currentNode;
            }
          }

          if (value !== undefined && currentNode.value === value) {
            return currentNode;
          }
      
          currentNode = currentNode.next;
        }
      
        return null;
      }
  }

  module.exports = {
    LinkedList: LinkedList
  }

  