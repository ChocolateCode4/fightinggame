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
window.onfocus = event => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
}

console.log("Hello")