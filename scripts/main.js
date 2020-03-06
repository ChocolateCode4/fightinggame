/* To Do:
(current = make jump for jump distance)
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
      Text = PIXI.Text,
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
    this.state = "idle";
    this.health = health;
    this.spawn = {
       x: 0,
       y: 0
    };
    
    this.speed = {
      def: 1.5,
      cur: 0
    };
    
    this.jumpDistance = 5;
    
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

class Movement {
  static walk(direction, player) {
    if(player.state == "idle") {
      if(direction == "right") {
        player.speed.cur = player.speed.def;
      } else if(direction == "left") {
        player.speed.cur = -player.speed.def;
      }
      if(direction == "neutral") {
        player.speed.cur = 0;
      }
    }
  }
}

// global
let player1,
    player2,
    playerGroup = [],
    gravityConfig,
    moveStorage = [],
    invisGround = new Graphics(),
    touchField = new Graphics();
    
newConsole = new Text("Console: ", {color: 0xffffff});
newConsole.x = 10;
newConsole.y = 50;

invisGround.beginFill(0x66CCFF);
invisGround.drawRect(0,320, 600, 1);
invisGround.endFill();

touchField.beginFill(0xffffff);
touchField.alpha = 0;
touchField.drawRect(0,0,window.innerWidth/2,window.innerHeight);
touchField.endFill();
touchField.interactive = true;

function init() {
  //create the canvas
  document.body.appendChild(app.view);
  //define players instance
  player1 = new Player("assets/forTest/blue.png", 100, "blue", "p1");
  player2 = new Player("assets/forTest/blue.png", 100, "blue2", "p2");
  playerGroup.push(player1,player2);
 // adds bounds for floor
 app.stage.addChild(invisGround);
 // gravity
 gravity("on");
 // control
 touchControl(player1);
 // render
 app.ticker.add(delta => gameLoop(delta))
 app.renderer.render(app.stage);
}

function touchControl(entity) {
  app.stage.addChild(touchField);
  touchStorage = {
    x: 0,
    y: 0
  };
  touchField.touchstart = event => {
    let touch = event.data.global;
    touchStorage.x = touch.x;
    touchStorage.y = touch.y;
  };
  touchField.touchmove = event => {
    let touch = event.data.global;
    difference = touch.x - touchStorage.x;
    differenceUp = touch.y - touchStorage.y;
    // config for left-right movement
    if(difference >= 40) {
      //right
      Movement.walk("right", entity);
    } else if(difference <= -40) {
      //left
      Movement.walk("left", entity);
    }
    // config for jump detecting
    if(differenceUp <= -50) {
      //jump
    } else if(differenceUp >= 50) {
      //crouch
    }
    
  };
  touchField.touchend = (event => Movement.walk("neutral", entity));
}

function gameLoop(delta) {
  //movement on x axis
  playerGroup.forEach((player) => {
    player.sprite.position.x += player.speed.cur;
  });
}

function gravity(state) {
  gravityConfig = {
    velocity: 4
  };
  let ticker = new Ticker();
  ticker.add(delta => {
    rigidBodies.forEach((body) => {
      if(body.position.y - invisGround.y >= 289) {
        body.position.y = 289;
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