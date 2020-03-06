// ALIAS //
const Application = PIXI.Application,
      Loader = PIXI.loader,
      Container = PIXI.Container,
      Resources = PIXI.loader.resources,
      Ticker = PIXI.Ticker,
      Graphics = PIXI.Graphics,
      Sprite = PIXI.Sprite,
      app = new Application({
        width: window.innerWidth,
        height: window.innerHeight,
       antialias: true
      });

// loader
Loader.add([
  "assets/forTest/blue.png"
  
  ]).load(window.onload = () => orientation());
  
class Player {
  constructor(sprite, health, selected, side) {
    this.sprite = new Sprite(Resources[sprite].texture);
    this.selected = selected;
    this.side = side;
    this.health = health;
    console.log(this.selected + " is created with " + this.health + "HP");
   
    this.spawn = {
       x: 0,
       y: 0
    };
    
    this.addPlayer();
  }
  addPlayer() {
    if(this.side === "p1") {
      this.spawn.x = 100;
      this.spawn.y = 200;
    } else if(this.side === "p2") {
      this.spawn.x = 500;
      this.spawn.y = 200;
    }
    app.stage.addChild(this.sprite);
    this.sprite.position.x = this.spawn.x;
    this.sprite.position.y = this.spawn.y;
  }
}

// global
const gravArray = [],
      rigidBody = new Container();
      
let player1,
    player2;

let gravity = new Ticker(),
    gravProperties = {
      force: 4,
      state: ""
    };
    
gravity.add(delta => {
  gravArray.forEach((bodies) => {
    let bodyPos = bodies.sprite.position;
    if(bodyPos.y - invisGround.y >= 288) {
      bodyPos.y += 0;
    } else {
      bodyPos.y += 4
    }
    
  });
});

gravity.start();

let invisGround = new Graphics();
invisGround.beginFill(0x66CCFF);
invisGround.drawRect(0,320, 600, 1);
invisGround.endFill();

function init() {
  //create the canvas
  document.body.appendChild(app.view);
  //define players instance
  player1 = new Player("assets/forTest/blue.png", 100, "blue", "p1");
  player2 = new Player("assets/forTest/blue.png", 100, "blue2", "p2");
  
 // adds bounds for floor
 app.stage.addChild(invisGround);
 
  // Gravity Definitions
  enableGravity([player1, player2]);
  gravArray.forEach((bodies) => {
    rigidBody.addChild(bodies);
  });
  
  // render
  app.renderer.render(app.stage);
}

function enableGravity(object) {
  object.forEach(objects => {
    gravArray.push(objects);
  });
}




function orientation() {
  const orientation = window.screen.orientation.type;
  
  if(orientation === "landscape-primary" || "landscape-secondary") {
    init();
  } else {
    window.alert("PORTRAIT MODE ISN'T SUPPORTED");
    location.reload();
  }
}