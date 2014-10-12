function MyObject() {
  this.hello = "hello"
  MyObject.prototype.say = function() {
    return this.hello
  }
}


function say(o) {
  console.log(o.say())
}

say(new MyObject())
