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
    this.rigidBodies = new Container();
  }
  render(container) {
    if(container == "all") {
     app.stage.addChild(this.entities);
     app.stage.addChild(this.rigidBodies);
   }
  }
}
      
class _Physics {
  constructor() {
    this.gravity = 5;
    this.inertia = 0;
  }
  
  gravityOn(entity) {
    this.gravityTicker = app.ticker.add(delta => {
      mainContainers.entities.y += this.gravity;
    });
  }
  applyRigidBody(body) {
    this.body = body;
    mainContainers.rigidBodies.addChild(this.body);
  }
  rigidBodyCollision(obj1,obj2, stopMovement) {
    /*this.obj1 = obj1;
    this.obj2 = obj2;
    if(hitTestRectangle(this.obj1,this.obj2) ) {
      this.obj1.gravityTicker.stop();
      this.obj2.gravityTicker.stop();
    }
    --- TODO: create a custom collision system using posX + width PosY + height, or maybe hitbox type ---
    
    */
  }
}
     
class _Entity {
  constructor() {
    this.stat = {
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
  
  static selectJoe() {
   
  }
}

let floor = new Graphics();
floor.beginFill(0xFF3300);
floor.drawRect(0, 220, 400, 5);
floor.endFill();

      
function setup() {
  mainContainers = new _Containers();
  physicsManager = new _Physics();
  mainCharacters = new _Character();
  mainContainers.render("all");
  physicsManager.gravityOn();
  physicsManager.applyRigidBody(floor);
  let player1, player2;
  let player = new _Entity();
  physicsManager.rigidBodyCollision(player, floor)
  player.create_update({sprite: "assets/forTest/blue.png"});
  player.addEntity();
}