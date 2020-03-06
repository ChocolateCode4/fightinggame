/* To Do:
1) touch movement/control but this time use animated/events especially for jump, don't rely on touch position. (entity based for future multiclients)
2) combat mechanics (damage, basic attacks)
3) create atlas sprites, use our JSON expertise.
4) create camera movement to follow selected player
5) create a prototype AI

*/

// ALIAS //
const Application = PIXI.Application,
      Loader = PIXI.loader,
      Container = PIXI.Container,
      Resources = PIXI.loader.resources,
      Ticker = PIXI.Ticker,
      Graphics = PIXI.Graphics,
      Sprite = PIXI.Sprite,
      rigidBodies = [],
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
    this.state;
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
    rigidBodies.push(this.sprite);
  }
}

// global
let player1,
    player2,
    gravityConfig,
    invisGround = new Graphics();
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
 // gravity
 gravity("on");
 // render
 app.renderer.render(app.stage);
}

function gravity(state) {
  gravityConfig = {
    velocity: 4
  };
  let ticker = new Ticker();
  ticker.add(delta => {
    rigidBodies.forEach((body) => {
      if(body.position.y - invisGround.y >= 288) {
        ticker.stop();
        body.position.y = 288;
        return "Gravity Stop";
      } else {
        body.position.y += gravityConfig.velocity;
        return "Gravity Running";
      }
    });
  });
  if(state == "on") {
    ticker.start();
  } else if(state == "off") {
    ticker.stop();
  }
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