/* To Do:
MAIN: fucking jump up needs to be done using limiter for playerpos.y and then apply it also to all objects
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
      app = new Application({
        width: window.innerWidth,
        height: window.innerHeight,
       antialias: true
      });

// loader
Loader.add([
  "assets/forTest/blue.png"
  
  ]).load(window.onload = () => orientation());
  
class Ground {
  constructor(x,y,w,h,col) {
    this.object = new Graphics();
    this.posPointer = this.object.position;
    this.object.beginFill(col);
    this.object.drawRect(0,0,w,h);
    this.object.endFill();
    this.object.y = y;
    this.object.x = x;
    this.propertyPointer = this.object;
    app.stage.addChild(this.object);
  }
}

class GameRules {
  static rbgroundcol(entity, ground) {
   if(entity.posPointer.y == ground.posPointer.y - entity.propertyPointer.height) {
     return true;
   }
   return false;
  }
  static groundObjects = [];
  static rigidBodies = [];
  static gravValue = 2;
  static playerMove() {
    playerGroup.forEach(player => {
      
     if(player.state == "onJumpRight"){
        player.jump.distVel = player.jump.defDistVel;
     } else if(player.state == "onJumpLeft") {
       player.jump.distVel = -player.jump.defDistVel;
     }
      
     let yDistance = player.standingPoint - (player.propertyPointer.height - player.jump.yDistance);
      if(player.posPointer.y > yDistance) {
        player.posPointer.y += player.jump.vel;
      } else {
        player.jump.vel = 0;
      }
      player.posPointer.x += player.jump.distVel;
      player.posPointer.x += player.speed.cur;
      if (player.posPointer.x < app.screen.x - 5) {
        player.posPointer.x = app.screen.x - 5;
        player.outofbounds = "oobL";
      }
      if (player.posPointer.x >= app.screen.width - 10) {
        player.posPointer.x = app.screen.width - 10;
        player.outofbounds = "oobR";
      }
    })
  }
  static gravity(state) {
    GameRules.rigidBodies.forEach(rb => {
      GameRules.groundObjects.forEach(go => {
        if(rb.posPointer.y + rb.propertyPointer.height <= go.posPointer.y) {
        rb.posPointer.y += GameRules.gravValue;
        rb.standingPoint = go.posPointer.y;
       } else {
         rb.posPointer.y = go.posPointer.y - rb.propertyPointer.height;
         if(rb.state == "onJumpLeft" || rb.state == "onJumpRight" || rb.state == "onJump") {
           rb.state = "idle";
           rb.canJump = true;
           rb.canWalk = true;
           rb.jump.distVel = 0;
         }
       }
      });
    });
    if(state == "off") {
      GameRules.gravValue = 0;
    } else if(state == "on") {
      GameRules.gravValue = 2;
    } else {
      throw console.error("Game Error: " + state + " isn't a gravity state!");
    }
  }
}

class Player {
  constructor(sprite, health, selected, side) {
    this.sprite = new Sprite(Resources[sprite].texture);
    this.selected = selected;
    this.side = side;
    this.standingPoint = 0;
    this.state = "idle";
    this.outofbounds;
    this.canJump = true;
    this.canWalk = true;
    this.canAttack = true;
    this.health = health;
    this.propertyPointer = this.sprite;
    this.posPointer = this.sprite.position;
    this.spawn = {
       x: 0,
       y: 0
    };
    
    this.speed = {
      def: 1.5,
      cur: 0
    };
    
    this.moveContainer = [];
    
    this.jump = {
      yDistance: -120,
      xDistance: 120,
      defVel: 7,
      defDistVel: 2.5,
      vel: 0,
      distVel: 0
    }
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

class Movement {
  static walk(dir,ent) {
    if(ent.canWalk == true) {
      switch(dir) {
        case "right":
          ent.speed.cur = ent.speed.def;
          break;
        case "left":
          ent.speed.cur = -ent.speed.def;
          break;
        case "neutral":
          ent.speed.cur = 0;
          break;
        default:
          throw console.error(dir + " IS NOT A DIRECTION!");
      }
    } else {
      ent.speed.cur = 0;
    }
  }
  static jump(dir,ent) {
    if(ent.canJump == true) {
      let potenX;
      switch(dir) {
        case "upright":
          ent.jump.vel = -ent.jump.defVel;
          ent.canJump = false;
          ent.canWalk = false;
          ent.state = "onJumpRight";
          break;
        case "upleft":
          ent.jump.vel = -ent.jump.defVel;
          ent.canJump = false;
          ent.canWalk = false;
          ent.state = "onJumpLeft";
          break;
        case "up":
          ent.jump.vel = -ent.jump.defVel;
          ent.canWalk = false;
          ent.canJump = false;
          ent.state = "onJump";
          break;
        default:
          throw console.error(ent + " CAN'T JUMP TO " + dir);
      }
    }
  }
}

// global
let player1,
    player2,
    playerGroup = [],
    moveStorage = [],
    touchField = new Graphics();
    
newConsole = new Text("Console: ", {color: 0xffffff});
newConsole.x = 10;
newConsole.y = 50;

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
  playerGroup.push(player1, player2);
  GameRules.rigidBodies.push(player1,player2);

  // bounds attempt next time use JSON for all of this bullcrap
  let ground = new Ground(0,450,600,10,"0xffffff");
  GameRules.groundObjects.push(ground);
 // control
 touchControl(player1);
 // render
 app.ticker.add(delta => gameLoop(delta))
 app.renderer.render(app.stage);
}

function showConsole(text) {
  let domConsole = document.querySelector("#console");
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
    if (differenceUp <= -30 && difference >= diff + 30) {
      //jump forward
      moveToContainer("ur", entity);
      Movement.jump("upright", entity);
    } else if (differenceUp >= 78 && difference <= diff) {
          //crouch guard
          moveToContainer("dl", entity);
          Movement.crouch("downleft", entity);
    } else if (differenceUp <= -30 && difference <= diff - 20) {
          //jump left
      moveToContainer("ul", entity);
      Movement.jump("upleft", entity);
    }
    if(differenceUp <= -50 && difference <= 2) {
      Movement.jump("up", entity)
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
  GameRules.gravity("on");
  GameRules.playerMove();
  
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