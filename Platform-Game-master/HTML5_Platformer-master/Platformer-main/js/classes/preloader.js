let stormheadPreload = new Image();
stormheadPreload.src = "/stormhead/idle.png";
stormheadPreload.addEventListener("load", () => {
  ctx.drawImage(stormheadPreload, 0, 0);
});

let stormheadPreloadRun = new Image();
stormheadPreloadRun.src = "/spritesheet/stormhead/run.png";
stormheadPreloadRun.addEventListener("load", () => {
    ctx.drawImage(stormheadPreloadRun, 0, 0);
}) 