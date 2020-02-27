let app = new PIXI.Application({
  width: 1024,
  height: 768
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
      Sprite = PIXI.Sprite,
      Graphics = PIXI.Graphics,
      Rectangle = PIXI.Rectangle;
      
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
    this.gravityTicker;
  }
  
  gravityOn(entity) {
    this.gravityTicker = app.ticker.add(delta => {
      entity.property.sprite.position.y += this.gravity;
    });
  }
  
  floorCollide(floor, player) {
    this.floor = floor;
    this.player = player;
    this.playerObj = this.player.property.sprite;
    this.playerPos = this.player.property.sprite.position;
   
    app.ticker.add(delta => {
      this.playerFoot = this.playerPos.y + (this.playerObj.height/2)
      if(this.playerFoot <= (this.floor.y - floor.height) && this.playerFoot > this.floor.y - 10) {
        console.log("collission detected at " + this.playerPos.y);
        this.gravityTicker.stop()
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
      skills: [],
      skillsCoolDown: []
    }
    
    this.property = {
      sprite: "",
      xSpawnPoint: 100,
      ySpawnPoint: 100
    }
    
    this.physics = {
      speed: 1.5,
      xVelocity: 0,
      yVelocity: 0
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
    
    // add sprite to container
   // app.stage.addChild(this.property.sprite);
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

function setup() {
  mainContainers = new _Containers();
  physicsManager = new _Physics();
  mainCharacters = new _Character();
  render("all");
  let player1, player2;
  player1 = new _Entity();
  player1.create_update({sprite: "assets/forTest/blue.png"});
  player1.addEntity();
  physicsManager.gravityOn(player1);
  physicsManager.floorCollide(floorBounds, player1);
}

function render(container) {
  if (container == "all") {

    app.stage.addChild(mainContainers.entities);
    app.stage.addChild(floorBounds);
  }
}