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
      Rectangle = PIXI.Rectangle;
      
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
      return "health updated: " + health;
    }
    if(armor !== undefined) {
      this.stat.armor = armor;
      return "armor updated: " + armor;
    }
    if(skills !== undefined) {
      this.stat.skills = skills;
      return "skills updated: " + skills;
    }
    if(skillsCoolDown !== undefined) {
      this.stat.skillsCoolDown = skillsCoolDown;
      return "CD updated: " + skillsCoolDown;
    }
    if(sprite !== undefined) {
      this.property.sprite = sprite;
      return "sprite updated: " + sprite;
    }
    if(xSpawnPoint !== undefined) {
      this.property.xSpawnPoint = xSpawnPoint;
      return "xSP updated: " + xSpawnPoint;
    }
    if(ySpawnPoint !== undefined) {
      this.property.ySpawnPoint = ySpawnPoint;
      return "ySP updated: " + ySpawnPoint;
    }
    if(speed !== undefined) {
      this.physics.speed = speed;
      return "speed updated: " + speed;
    }
    if(xVelocity !== undefined) {
      this.physics.xVelocity = xVelocity;
      return "xVel updated: " + xVelocity;
    }
    if(yVelocity !== undefined) {
      this.physics.yVelocity = yVelocity;
      return "yVel updated: " + yVelocity;
    }
  }
}

class _Character extends _Entity {
  constructor() {
    
  }
  
  static selectJoe() {
   
  }
}
      
function setup() {
  let player1, player2;
  let player = new _Entity();
  console.log(player.create_update({armor:100}) );
  console.log(player.physics.speed)
}