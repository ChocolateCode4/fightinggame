/* TODO: 
(1) MAIN: set a limiter for jump height, idea: disallow pointer from moving probably have to make pointer storage global
(2) create a new opponent/npc
(3) make test sprites for 6f attackS
(4) simulate damage

*/

let app = new PIXI.Application({
  width: 1024,
  height: 600
});

document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.antialias = true;
app.renderer.backgroundColor = 0xe6f9ff;
let loader = PIXI.loader,
      Container = PIXI.Container,
      resources = PIXI.loader.resources,
      TextureCache = PIXI.utils.TextureCache,
      Ticker = PIXI.Ticker;
      Sprite = PIXI.Sprite,
      Graphics = PIXI.Graphics,
      Rectangle = PIXI.Rectangle,
      ctrlScreen = new Object;
      
loader.
    add([
      "assets/players/idleJoe.png",
      "assets/forTest/blue.png"
      ]).load(setup);
      
//pre-setup variables
let mainContainers, physicsManager, PhaseManager, mainCharacters, entityManager;
      
class _Containers extends PIXI.Container {
  constructor() {
    super();
    this.entities = new Container();
    this.floorObjects = new Container();
  }
}


      
class _Physics {
  constructor() {
    this.gravity = 5;
    this.inertia = 0;
    this.gravityTicker = new Ticker();
  }
  
  gravityOn(entity, fromJump) {
   if(fromJump === true) {
    this.gravityTicker.add(delta => {
      entity.position.y += this.gravity;
      }) ;
    } else if(fromJump === false) {
      this.gravityTicker.add(delta => {
       entity.property.sprite.position.y += this.gravity;
    });
   }
   this.gravityTicker.start();
  }

  floorCollide(floor, player) {
    this.floor = floor;
    this.player = player;
    this.playerObj = this.player.property.sprite;
    this.playerPos = this.player.property.sprite.position;
   
    app.ticker.add(delta => {
      this.playerFoot = this.playerPos.y + (this.playerObj.height/2);
      if(this.playerFoot < (this.floor.y - this.floor.height) && this.playerFoot > this.floor.y - 10) {
        this.gravity = 0;
      } 
      
      else {
        this.gravity = 5;
      }
    });
  }
}
     
class _Entity {
  constructor() {
    this.stat = {
      side: "p1",
      state: "idle",
      health: 100,
      armor: 50,
      energy: 0,
      skills: [],
      skillsCoolDown: []
    };
    
    this.property = {
      sprite: "",
      xSpawnPoint: 100,
      ySpawnPoint: 100
    };
    
    this.physics = {
      speed: 1.5,
      jumpLimit: 10,
      xVelocity: 0,
      yVelocity: 0
    };
   this.mTicker = new Ticker();
   this.mTicker.add(delta => {
   this.spritePos = this.property.sprite.position;
   this.spritePos.x += this.physics.xVelocity;
   this.spritePos.y += this.physics.yVelocity;
   });
   this.mTicker.start();
  }
  doMove(bool,direction) {
    if(bool === true) {
      //jump config
      this.jumpHeight = this.property.sprite.position.y + this.physics.jumpLimit;
      this.currentHeight = this.property.sprite.position.y + 0;
      // x config
      this.speed = this.physics.speed;
      this.tick = new Ticker();
      this.tick.add(delta => {
        if(direction == "l") {
         this.physics.xVelocity = -(this.speed);
        }
        if (direction == "r") {
          this.physics.xVelocity = this.speed;
        }
        if(direction == "u") {
         if(this.currentHeight != this.jumpHeight) {
           this.currentHeight++;
           this.physics.yVelocity = -15;
         } else {
           this.currentHeight = 
           this.physics.yVelocity = 0;
         }
         
       }
       if(direction == "n") {
         this.property.sprite.position.y + 0;
         this.physics.xVelocity = 0;
         this.physics.yVelocity = 0;
       }
      });
       this.tick.start();
     }
   }
   
   create_update({
    health,armor,skills,skillsCoolDown,sprite,xSpawnPoint,ySpawnPoint,speed,xVelocity,yVelocity
   }) {
    // set stats properly
    if(health !== undefined){
      this.stat.health = health;
    }
    if(armor !== undefined) {
      this.stat.armor = armor;
    }
    if(skills !== undefined) {
      this.stat.skills = skills;
    }
    if(skillsCoolDown !== undefined) {
      this.stat.skillsCoolDown = skillsCoolDown;
    }
    if(sprite !== undefined) {
      this.property.sprite = new Sprite(resources[sprite].texture);
      mainContainers.entities.addChild(this.property.sprite);
    }
    if(xSpawnPoint !== undefined) {
      this.property.xSpawnPoint = xSpawnPoint;
    }
    if(ySpawnPoint !== undefined) {
      this.property.ySpawnPoint = ySpawnPoint;
    }
    if(speed !== undefined) {
      this.physics.speed = speed;
    }
    if(xVelocity !== undefined) {
      this.physics.xVelocity = xVelocity;
    } 
    if(yVelocity !== undefined) {
      this.physics.yVelocity = yVelocity;
    }
  }
  addEntity() {
    this.SpritePos = this.property.sprite.position;
    this.SpritePos.x = this.property.xSpawnPoint;
    this.SpritePos.y = this.property.ySpawnPoint;
  }
}

class _Character extends _Entity {
  constructor() {
    super();
    this.data = {
      name: "",
      description: "",
      playstyle: "",
      playerside: ""
    }
    this.interfaceSprites = {
      profile: "",
      special: "",
      special2: ""
    }
  }
  
  static selectJoe(side) {
   
  }
}

let floorBounds = new Graphics();
floorBounds.beginFill(0xFF3300);
floorBounds.drawRect(0, 0, 400, 5);
floorBounds.y = 400;
floorBounds.endFill();

function controlEntity(entity) {
  ctrlScreen = new Graphics();
  ctrlScreen.beginFill(0xFF3300);
  ctrlScreen.drawRect(0,0,150,800);
  ctrlScreen.alpha = 0;
  ctrlScreen.endFill();
  ctrlScreen.interactive = true;
  let storage = {
    y: 0,
    x: 0
  };
  ctrlScreen.touchstart = event => {
    let pointer = event.data.global;
    storage.y = pointer.y;
    storage.x = pointer.x;
  };
  ctrlScreen.touchmove = event => {
    let pointer = event.data.global;
    if(pointer.x > storage.x + 30 && pointer.x < ctrlScreen.width) {
      entity.doMove(true, "r");
    }
    if(pointer.x < storage.x - 30 && pointer.x < ctrlScreen.width) {
      entity.doMove(true, "l");
    }
    if(pointer.y < storage.y - 50) {
      entity.doMove(true, "u");
      storage.y = 0;
    }
  };
  ctrlScreen.touchend = event => {
    entity.doMove(true, "n");
  };
  ctrlScreen.touchendoutside = event => {
    entity.doMove(true, "n");
  };
  app.stage.addChild(ctrlScreen);
}

function setup() {
  mainContainers = new _Containers();
  physicsManager = new _Physics();
  mainCharacters = new _Character();
  render("all");
  let player1, player2;
  player1 = new _Entity();
  player1.create_update({sprite: "assets/forTest/blue.png", speed: 3});
  player1.addEntity();
  controlEntity(player1)
  physicsManager.gravityOn(player1, false);
  physicsManager.floorCollide(floorBounds, player1);
}

function render(container) {
  if (container == "all") {

    app.stage.addChild(mainContainers.entities);
    app.stage.addChild(floorBounds);
  }
}