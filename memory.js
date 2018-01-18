if(!window.NVDS) window.NVDS = new Object();

document.addEventListener("DOMContentLoaded", function(event){
  new NVDS.Memory();
});

NVDS.Memory = function NVDS_Memory(){
  this.init();
  this.cards = 0;
  this.canvas = '';
  this.context = '';
  this.bgImage = '';
  this.canvasWidth = 0;
  this.canvasHeight = 0;
}

NVDS.Memory.prototype.constructor = NVDS.Memory;

NVDS.Memory.prototype.init = function(){
  this.setCards(36);
  this.setUpCanvas();
  this.addEventListeners();
}

NVDS.Memory.prototype.setCards = function(amount){
  this.cards = amount;
}

NVDS.Memory.prototype.getCards = function(){
  return this.cards;
}

NVDS.Memory.prototype.setUpCanvas = function(){
  var canvas = document.getElementById("memory");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  this.context = canvas.getContext("2d");

  this.canvasWidth = canvas.width;
  this.canvasHeight = canvas.height;
  this.canvas = canvas;
  this.button = [];
  this.images = [];

  this.setImages();
  this.generateCards();
  //this.setBackground();
}

NVDS.Memory.prototype.getContext = function(){
  var canvas = document.getElementById("memory");
  return canvas.getContext("2d");
}

NVDS.Memory.prototype.addEventListeners = function(){
  var me = this;
  var canvas = this.canvas;
  canvas.addEventListener('click', function(evt){
    me.checkClick(evt);
  })
}

NVDS.Memory.prototype.setBackground = function(){
  var context = this.context;
  var width = this.canvasWidth;
  var height = this.canvasHeight;

  var bgImage = new Image();
  bgImage.src = "assets/img/bg2.jpeg";
  bgImage.onload = function(){
    bgImage.style.width = "100%";
    context.drawImage(bgImage, 0, 0, width, height);
  }

  this.bgImage = bgImage;
}

NVDS.Memory.prototype.generateCards = function(){
  var rows = Math.sqrt(this.cards);
  var spaces = rows * 2 * 10;
  var height = (this.canvasHeight - spaces)/ rows;
  var width = height;

  var lastx = 10;
  var lasty = 10;

  for(var i=1; i<rows + 1; i++){
    for(var j=1; j<rows +1; j++){
      var context = this.getContext();
      var img = this.getRandomImg();

      context.fillStyle = "#F0F";
      context.fillRect(lastx, lasty, width, height);
      this.button.push({
        x: lastx,
        y: lasty,
        width: width,
        height: height,
        clicked: false,
        img: img
      });
      lastx = lastx + width + 10;
      if(j % rows == 0){
        lastx = 10;
      }
    }

    lasty = lasty + height + 10;
    if(i % rows == 0){
      lasty = 10;
    }
  }

  console.log(this.button);
}

NVDS.Memory.prototype.setImages = function(){
  var images = [];
  for(var i=0; i<18; i++){
    var j = i + 1;
    images[i] = {src: "card-" + j + ".jpg", set:0};
  }
  this.images = images;
}

NVDS.Memory.prototype.getRandomImg = function(){
   var img = this.selectRandomImg();

   return img.src;
}

NVDS.Memory.prototype.selectRandomImg = function(){
  var images = this.images;
  var rand = Math.round(Math.random() * (images.length -1));
  var set = images[rand].set;
  images[rand].set = set + 1;
  if(images[rand].set >= 2){
  
  }

  this.images = images;
  console.log(this.images);
  return images[rand];
}

NVDS.Memory.prototype.getMousePosition = function(evt){
  var target = evt.target;
  if(target.tagName == "CANVAS"){
    var rect = target.getBoundingClientRect();
    return {
      x : evt.clientX - rect.left,
      y : evt.clientY - rect.top
    }
  }

  return false;
}

NVDS.Memory.prototype.checkClick = function(evt){
  var canvas = this.canvas;
  var mousePos = this.getMousePosition(evt);
  this.clickCard(mousePos);
}

NVDS.Memory.prototype.clickCard = function(mousePos){
  var cards = this.button;
  for(var i=0; i<cards.length; i++){
    var res = this.clickInsideCard(this.button[i], mousePos)
    if(res){
      if(!this.button[i].clicked){
        this.rotateCard(this.button[i]);
        this.button[i].clicked = true;
      } else {
        this.rotateCardBack(this.button[i]);
        this.button[i].clicked = false;
      }
    }
  }
}

NVDS.Memory.prototype.clickInsideCard = function(rect, pos){
  return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

NVDS.Memory.prototype.rotateCard = function(card){
  var context = this.getContext();
  var img = new Image();
  img.src = "assets/img/cards/" + card.img;
  img.onload = function(){
    context.drawImage(img, card.x, card.y, card.width, card.height);
  }
}

NVDS.Memory.prototype.rotateCardBack = function(card){
  var context = this.getContext();
  context.fillStyle = "#F0F";
  context.fillRect(card.x, card.y, card.width, card.height);
}
