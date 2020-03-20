/* To Do:
MAIN: FIX out of bounds also make the oob hit to run/complete jump ticker rather than stop it, form like a for loop
2) MAIN: sprtites/json data files 
then combat mechanics (damage, basic attacks)
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
    this.jumping = false;
    this.spawn = {
       x: 0,
       y: 0
    };
    
    this.speed = {
      def: 1.5,
      cur: 0
    };
    
    this.moveContainer = [];
    
    this.jumpDistance = 130;
    this.jumpVelocity = 7;
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
  static jump(direction, player) {
    if(player.state == "idle") {
      player.state = "jumping";
      this.playerPos = player.sprite.position;
      this.jumpDistance = {
        l: player.sprite.position.x - player.jumpDistance,
        r: player.sprite.position.x + player.jumpDistance
      };
      
      //ticker
      this.jumpTicker = new Ticker();
      this.destroyTicker = false;
      if(direction == "upright") {
        this.jumpTicker.add(delta => {
          if (this.playerPos.x < this.jumpDistance.r) {
            if(player.state != "oob") {
               this.playerPos.y -= 15;
               this.playerPos.x += player.jumpVelocity;
            }
          }
        });
      }
      if(direction == "upleft") {
        this.jumpTicker.add(delta => {
          if (this.playerPos.x > this.jumpDistance.l) {
            if(player.state != "oob") {
               this.playerPos.y -= 15;
               this.playerPos.x -= player.jumpVelocity;
            }
          }
        });
      }
      if(direction == "up") {
        console.log("up")
      }
      this.jumpTicker.add(delta => {
        if (this.playerPos.y - invisGround.y >= 289) {
          player.state = "idle";
          Movement.walk("neutral", player)
          this.destroyTicker = true;
        }
        if(this.destroyTicker === true) {
          this.jumpTicker.destroy();
        }
      })
      this.jumpTicker.start();
    }
  }
  static crouch(direction, player) {
    
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
touchField.drawRect(0,0,window.innerWidth,window.innerHeight);
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

function showConsole(text) {
  let domConsole = document.getElementById("console");
  domConsole.innerText = text;
}

function moveToContainer(move, entity) {
  function reset() {
    entity.moveContainer = [];
  }
  if(entity.moveContainer.length > 4) {
    reset();
  }
  function filterDupl(moves) {
    for(x=0;x<moves.length;x++) {
      if(moves[x] === moves[x+1]) {
        moves.pop();
      }
    }
  }
  entity.moveContainer.push(move);
  filterDupl(entity.moveContainer)
}

function touchControl(entity) {
  app.stage.addChild(touchField);
  function doMove(event,diff) {
    let touch = event.data.global;
    difference = touch.x - touchStorage.x;
    differenceUp = touch.y - touchStorage.y;
        // config for  detecting
    if (differenceUp <= -30 && difference >= diff + 20) {
      //jump forward
      moveToContainer("ur", entity);
      Movement.jump("upright", entity);
    } else if (differenceUp >= 50 && difference <= diff) {
          //crouch guard
          moveToContainer("dl", entity);
          Movement.crouch("downleft", entity);
    } else if (differenceUp <= -30 && difference <= diff - 20) {
          //jump left
      moveToContainer("ul", entity);
      Movement.jump("upleft", entity);
    }
    if(differenceUp >= 50 && difference ) {
      moveToContainer("d", entity);
    }
    // config for left-right movement
    if (difference >= diff) {
      //right
      moveToContainer("r",entity);
      Movement.walk("right", entity);
    } else if (difference <= -diff) {
      //left
      moveToContainer("l", entity);
      Movement.walk("left", entity);
    }

  }
  touchStorage = {
    x: 0,
    y: 0
  };
  touchField.touchstart = event => {
    let touch = event.data.global;
    touchStorage.x = touch.x;
    touchStorage.y = touch.y;
  };
  touchField.touchmove = event => doMove(event, 10);
  touchField.touchcancel = event => { 
    touchStorage.x = event.data.global.x;
    doMove(event, 5);
  };
  touchField.touchend = (event => Movement.walk("neutral", entity));
} 

function gameLoop(delta) {
  //movement on x axis
  playerGroup.forEach((player) => {
    player.sprite.position.x += player.speed.cur;
    if(player.sprite.position.x < app.screen.x - 5) {
      player.sprite.position.x = app.screen.x - 5;
      player.state = "oob";
    } 
    if(player.sprite.position.x >= app.screen.width - 10) {
      player.sprite.position.x = app.screen.width - 10;
      player.state = "oob";
    }
  
    
  });
}

function retFloorHit(data) {
  
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
    window.prompt("PORTRAIT MODE ISN'T SUPPORTED");
    location.reload();
  }
}