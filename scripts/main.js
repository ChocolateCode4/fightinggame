let app = new PIXI.Application({
  width: 0,
  height: 0
})

document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.antialias = true;
app.renderer.backgroundColor = 0xe6f9ff;
function resizeScreen() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}
window.onload = event => resizeScreen();
window.onfocus = event => resizeScreen();

let loader = PIXI.loader,
      Container = PIXI.Container,
      resources = PIXI.loader.resources,
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Graphics = PIXI.Graphics,
      Rectangle = PIXI.Rectangle
      
loader.
    add([
      "assets/players/idleJoe.png",
      "assets/forTest/blue.png"
      ]).load(setup)
      
class _Entity {
  constructor() {
    this.stat = {
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
    
    app.stage.addChild(this.property.sprite);
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
      
function setup() {
  let player1, player2;
  let player = new _Entity();
  player.create_update({sprite: "assets/forTest/blue.png"});
  player.addEntity()
}