  /* To Do:
MAIN: perform attack keeps being called, instead use gameLoop and inherent class variables
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

async function fetchData(data) {
  let newData = await fetch(data);
  let dataObj = await newData.json();
  return dataObj;
}

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

class OnScreenControl {
  constructor(x,y,entity) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.button2 = new Graphics();
    this.button2.beginFill("0xffffff", 0.75)
    this.button2.drawCircle(this.x, this.y, this.size);
    this.button2.endFill();
    this.button1 = new Graphics();
    this.button1.beginFill("0xffffff", 0.75)
    this.button1.drawCircle(this.x-(this.size*2.25), this.y + (this.size/4), this.size);
    this.button1.endFill();
    this.button1.interactive = true;
    this.button2.interactive = true;
   app.stage.addChild(this.button1, this.button2);
  }
  defaultListener(entity) {
    this.button1.touchstart = event => {
      moveToContainer("lp", entity);
    }
    this.button2.touchstart = event => {
      moveToContainer("sp", entity);
    }
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
  constructor(sprite, health, selected, side, jsonFile) {
    this.jsonFile = jsonFile;
    this.newData;
    this.dataObj;
    this.sprite = new Sprite(Resources[sprite].texture);
    this.selected = selected;
    this.side = side;
    this.standingPoint = 0;
    this.front; //sends left or right data
    this.state = "idle";
    this.enemy;
    this.outofbounds;
    this.canJump = true;
    this.canWalk = true;
    this.canAttack = true;
    this.canBeHit = true;
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
      this.spawn.x = 330;
      this.spawn.y = 200;
    }
    app.stage.addChild(this.sprite);
    this.sprite.position.x = this.spawn.x;
    this.sprite.position.y = this.spawn.y;
  }
  
 async dataFetch() {
    this.newData = await fetch(this.jsonFile);
    this.dataObj = await this.newData.json()
  }
  
  listenAttackInput() {
    let movesQueue = new Array;
    let listen = () => {
      let lastInput = this.moveContainer[this.moveContainer.length-1];
     /* movesQueue.forEach(eQueue => {
        let elimInput = eQueue.inputR.filter(eQueried => {
          return eQueried !== lastInput;
        });
      });*/
      //showConsole(lastInput)
      for(let x =0; x<movesQueue.length;x++) {
        //gets all inputR but still an array of inputs
        let allInputs = movesQueue[x].inputR;
        
        for(let y=0;y<this.moveContainer.length;y++) {
          if(allInputs[0] == this.moveContainer[y] && allInputs[1] == this.moveContainer[y+1]&& allInputs[2] == this.moveContainer[y+2]&& allInputs[3] == this.moveContainer[y+3]&& allInputs[4] == this.moveContainer[y+4]&& allInputs[5] == this.moveContainer[y+5]) {
            this.performAttack(movesQueue[x]);
          }
         
        }
        /*
        if(lastInput == allInputs[0]) {
           
        } else if(lastInput !== allInputs[0]) {
          //nest a ghost input check
          allInputs.splice(0,1);
          resetInput();
        }
        if(allInputs.length <= 0) {
          showConsole("performing: " + movesQueue[x].name)
        }*/
        //showConsole(allInputs);
        /*
        if(allInputs[x].length == 0) {
          performAttack(allInputs[x].name);
        }
        if(lastInput == ) {
          showConsole("down")
        }*/
      }
    }
    if(this.dataObj !== undefined) {
     this.dataObj.moves.forEach(eMoves => {
       movesQueue.push(eMoves);
     });
     listen()
    }
  }
  performAttack(attack) {
    showConsole(attack.name);
    console.log(attack.property)
    switch(attack.property) {
      case "projectile":
        console.log("hadu fucking ken");
        break;
      default:
        return 0
    }
  }
}

class Movement {
  static crouch(dir,entity) {
    
  }
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
    touchField = new Graphics(),
    moveTimer = new Ticker();
    
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
  player1 = new Player("assets/forTest/blue.png", 100, "blue", "p1", "scripts/characters/joe.json");
  player1.dataFetch();
 // player1.listenAttackInput();
  player2 = new Player("assets/forTest/blue.png", 100, "blue2", "p2");
  player1.enemy = player2;
  player2.enemy = player1;
  playerGroup.push(player1, player2);
  GameRules.rigidBodies.push(player1,player2);

  // bounds attempt next time use JSON for all of this bullcrap
  let ground = new Ground(0,450,600,10,"0xffffff");
  GameRules.groundObjects.push(ground);
 // control
 touchControl(player1);
 let touchButtons = new OnScreenControl(100,200, player1)
 touchButtons.defaultListener(player1)
 // render
 app.ticker.add(delta => gameLoop(delta))
 app.renderer.render(app.stage);
}

function updateFront(arr) {
  arr.forEach(entity => {
    if(entity.posPointer.x > entity.enemy.posPointer.x) {
      entity.front = "left";
    } else if(entity.posPointer.x < entity.enemy.posPointer.x) {
      entity.front = "right";
    }
  });
}

function showConsole(text) {
  let domConsole = document.querySelector("#console");
  domConsole.innerText = text;
}

function moveToContainer(move, entity) {
  function reset() {
    entity.moveContainer = [];
  }
  if(entity.moveContainer.length > 100) {
    reset();
  }
  function filterDupl(moves) {
    for(x=0;x<moves.length;x++) {
      if(moves[x] === moves[x+1] && moves[x+1] !== "lp") {
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
    if (differenceUp <= -20 && difference >= diff + 30) {
      //jump forward
      moveToContainer("ur", entity);
      Movement.jump("upright", entity);
    } else if (differenceUp >= 78 && difference <= diff) {
          //crouch guard
          moveToContainer("dl", entity);
          Movement.crouch("downleft", entity);
    } else if (differenceUp <= -20 && difference <= diff - 20) {
          //jump left
      moveToContainer("ul", entity);
      Movement.jump("upleft", entity);
    }
    if(differenceUp <= -20 && difference <= 2) {
      moveToContainer("u",entity);
      Movement.jump("up", entity)
    }
    if(differenceUp >= 10 && difference <= 4 ) {
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
moveTimer.update()
function gameLoop(delta) {
  GameRules.gravity("on");
  GameRules.playerMove();
  player1.listenAttackInput();
  
  updateFront([player1,player2]);
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