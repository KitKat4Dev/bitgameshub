let stormheadPreload = new Image();
stormheadPreload.src = "/stormhead/idle.png";
stormheadPreload.addEventListener("load", () => {
  ctx.drawImage(stormheadPreload, 0, 0);
});