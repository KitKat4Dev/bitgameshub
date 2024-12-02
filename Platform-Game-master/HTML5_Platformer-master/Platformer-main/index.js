const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let loaded = false;

player.load();
let plSpeed = 5;

enemies.forEach((enemy) => {
  enemy.load();
});
finishLine.load();
let keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  space: { pressed: false },
};

/* ========================================== */
//ANIMATE
/* ========================================== */

var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

function animate() {
  let game = window.requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.velocity.x = 0;

    moveScreen();
    drawBackgrounds();
    drawPlatforms();
    checkPlayerPosition();

    finishLine.update();
    player.update();
    enemies.forEach((enemy) => {
      enemy.update();
    });
    checkWin(game);
  }
}

startAnimating(54);

window.addEventListener("keydown", checkKeydown);
window.addEventListener("keyup", checkKeyup);

// prevent scroll on spacebar press
window.addEventListener("keydown", function (e) {
  if (e.key == " ") {
    e.preventDefault();
  }
});


function checkWin(game) {
  if (player.dead) {
    window.cancelAnimationFrame(game);
    gameover();
  }
  if (
    player.position.x + player.hitbox.width >= finishLine.position.x &&
    player.position.x <= finishLine.position.x + finishLine.hitbox.width &&
    player.position.y <= finishLine.position.y + finishLine.hitbox.height &&
    player.position.y + player.hitbox.height >= finishLine.position.y
  ) {
    winGame(game);
    win.play();
  }
}

function winGame(game) {
  window.cancelAnimationFrame(game);
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.add("active");
  overlay.style.color = "green";
  overlay.style.backgroundColor = "black";

  let header = overlay.getElementsByTagName("h2")[0];
  header.textContent = "Congratulations!";
  header.style.fontSize = "6em";

  let caption = overlay.getElementsByTagName("p")[0];
  caption.textContent = "You found your way!";

  fadeAudio();
}

function fadeAudio() {
  let bgAudio = document.getElementById("bg-music");

  var fadeAudio = setInterval(function () {
    if (bgAudio.volume > 0.1) bgAudio.volume -= 0.1;
    if (bgAudio.volume === 0.0) clearInterval(fadeAudio);
  }, 200);
}

function gameover() {
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.add("active");
  player.die();
  fadeAudio();
}

function startGame() {
  player.dead = false;
  player.position.x = 100;
  player.position.y = 0;
  animate();
}

function drawBackgrounds() {
  backgrounds.forEach((background) => {
    background.drawSprite();
  });
}

function drawPlatforms() {
  platforms.forEach((platform) => {
    platform.drawSprite();
  });
  playerPlatforms.forEach((platform) => {
    platform.drawSprite();
  });
}

function drawFinishLine() {
  finishLine.update();
}

function checkKeydown(e) {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      if (player.grounded && !player.charged) player.jump();
      if (player.grounded && player.charged) player.superJump();
      player.charged = false;
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case " ":
      if (!player.attacking) player.attacking = true;
      keys.space.pressed = true;
  }
}

function checkKeyup(e) {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      player.charged = false;
    case " ":
      keys.space.pressed = false;
      player.attacking = false;
      if (!keys.a.pressed && !keys.d.pressed) player.switchSprite("idle");
      player.update();
  }
}

function checkPlayerPosition() {
  if (keys.d.pressed && player.lastKey === "d") {
    if (player.position.x < 400) {
      player.velocity.x = plSpeed;
      !player.attacking
        ? player.switchSprite("run")
        : player.switchSprite("attack_right");
    } else if (player.position.x >= 400) {
      player.velocity.x = 0;
      !player.attacking
        ? player.switchSprite("run")
        : player.switchSprite("attack_right");
    }
  } else if (keys.a.pressed && player.lastKey === "a") {
    if (player.position.x > 300) {
      player.velocity.x = -plSpeed;
      !player.attacking
        ? player.switchSprite("run_left")
        : player.switchSprite("attack_left");
    } else if (player.position.x <= 300) {
      player.velocity.x = 0;
      !player.attacking
        ? player.switchSprite("run_left")
        : player.switchSprite("attack_left");
    }
  }

  if (!keys.d.pressed && !keys.a.pressed && keys.space.pressed) {
    player.velocity.x = 0;
    if (player.lastKey === "d") {
      player.switchSprite("attack_right");
    } else if (player.lastKey === "a") {
      player.switchSprite("attack_left");
    }
  }

  if (!keys.d.pressed && !keys.a.pressed && !keys.space.pressed) {
    if (player.lastKey == "d" || player.lastKey == null) {
      player.switchSprite("idle");
    } else if (player.lastKey == "a") {
      player.switchSprite("idle_left");
    }
  }
}


function moveScreen() {
  if (player.position.x >= 400 && player.lastKey === "d") {
    if (keys.d.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= plSpeed;
      });
      playerPlatforms.forEach((platform) => {
        platform.position.x -= plSpeed;
      });
      enemies.forEach((enemy) => {
        enemy.position.x -= plSpeed;
      });
      finishLine.position.x -= plSpeed;
      parallaxBackground(-1);
    }
  } else if (player.position.x <= 300 && player.lastKey === "a") {
    if (keys.a.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += plSpeed;
      });
      playerPlatforms.forEach((platform) => {
        platform.position.x += plSpeed;
      });
      enemies.forEach((enemy) => {
        enemy.position.x += plSpeed;
      });
      finishLine.position.x += plSpeed;
      parallaxBackground(1);
    }
  }
}

function activateSuperJump() {
  player.charged = true;
  return;
}

function parallaxBackground(dir) {
  for (let i = backgrounds.length - 1; i > 0; i--) {
    backgrounds[i].position.x += 0.05 * i * dir;
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

function playSound(sound) {
  switch (sound) {
    case "jump":
      jump.play();
      break;
    case "attack_charge":
      attackCharge.play();
      break;
    case "attack":
      attack.play();
      break;
    case "enemy_attack":
      enemyAttack.play();
      break;
    case "enemy_die":
      enemyDie.play();
  }
}
