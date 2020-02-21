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