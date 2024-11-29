const tileSize = 50;
canvas.width = 1024;
canvas.height = 576;

let jump = new Audio("audio/jump75.wav");
jump.preload = "auto";
jump.volume = 0.2;


let attackCharge = new Audio("audio/powerup85.wav");
attackCharge.preload = "auto";
attackCharge.volume = .3;

let attack = new Audio("audio/explosion112.wav");
attack.preload = "auto";
attack.volume = 1;

let enemyAttack = new Audio("audio/laserShoot163.wav");
enemyAttack.preload = "auto";
enemyAttack.volume = .5;
enemyAttack.playbackRate = .7;

let enemyDie = new Audio("audio/enemy_die.wav");
enemyDie.preload = "auto";
enemyDie.volume = .7

let plDie = new Audio("audio/marioDeathSound.wav");
plDie.preload = "auto";
plDie.volume = 1;

let win = new Audio("audio/OOT_Secret.wav");
win.preload = "auto";



const player = new Player({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  imageSrc: "spritesheet/blue_witch/B_witch_idle.png",
  frames: {
    x: 1,
    y: 6,
  },
  scale: 3,
  offset: {
    x: -22,
    y: -20,
  },
  hitbox: {
    width: 45,
    height: 100,
  },
  sprites: {
    idle: {
      imageSrc: "spritesheet/blue_witch/B_witch_idle.png",
      frames: {
        x: 1,
        y: 6,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    idle_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_idle_left.png",
      frames: {
        x: 1,
        y: 6,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    run: {
      imageSrc: "spritesheet/blue_witch/B_witch_run.png",
      frames: {
        x: 1,
        y: 8,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    run_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_run_left.png",
      frames: {
        x: 1,
        y: 8,
      },
      hitFrame: 99,
      offset: {
        x: -22,
        y: -20,
      },
    },
    attack_right: {
      imageSrc: "spritesheet/blue_witch/B_witch_attack.png",
      frames: {
        x: 1,
        y: 9,
      },
      hitFrame: 6,
      attackHitBox: {
        dir: 1,
        width: 250,
        height: 100,
      },
      offset: {
        x: -22,
        y: -20,
      },
    },
    attack_left: {
      imageSrc: "spritesheet/blue_witch/B_witch_attack_left.png",
      frames: {
        x: 1,
        y: 9,
      },
      hitFrame: 6,
      attackHitBox: {
        dir: -1,
        width: 250,
        height: 100,
      },
      offset: {
        x: -225,
        y: -20,
      },
    },
  },
});

const platform = new Platform({
  position: {
    x: 100,
    y: canvas.height - tileSize,
  },
  imageSrc: "spritesheet/platforms/flat-platform.png",
  tiles: 5,
});

const platforms = [
  new Platform({
    position: {
      x: 100,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 700,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 4,
  }),
  new Platform({
    position: {
      x: 1000,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 3,
  }),
  new Platform({
    position: {
      x: 1250,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 1500,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 1700,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 1900,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 6,
  }),
  new Platform({
    position: {
      x: 2350,
      y: canvas.height - tileSize - 175,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 6,
  }),
  new Platform({
    position: {
      x: 2700,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 3300,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 3900,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 4900,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 5100,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 2,
  }),
  new Platform({
    position: {
      x: 5500,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 5,
  }),
  new Platform({
    position: {
      x: 5700,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
];

const playerPlatforms = [
  new Platform({
    position: {
      x: 2800,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 3050,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 3275,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 3500,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 3725,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 3900,
      y: canvas.height - tileSize,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 4500,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 4600,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 4700,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 4800,
      y: canvas.height - tileSize - 400,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 5200,
      y: canvas.height - tileSize - 200,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 5200,
      y: canvas.height - tileSize - 350,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 5300,
      y: canvas.height - tileSize - 350,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 5400,
      y: canvas.height - tileSize - 350,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 1,
  }),
  new Platform({
    position: {
      x: 5500,
      y: canvas.height - tileSize - 100,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 4,
  }),
  new Platform({
    position: {
      x: 5700,
      y: canvas.height - tileSize - 300,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 10,
  }),
  new Platform({
    position: {
      x: 6425,
      y: canvas.height - tileSize - 250,
    },
    imageSrc: "spritesheet/platforms/flat-platform.png",
    tiles: 3,
  }),
];

const enemySprites = {
  right: {
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
  },
  left: {
    imageSrc: "spritesheet/reaper-left/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
  },
  attack_left: {
    imageSrc: "spritesheet/reaper-left/attacking.png",
    frames: {
      x: 6,
      y: 1,
    },
    hitFrame: 4,
    attackHitBox: {
      dir: -1,
      width: 50,
      height: 100,
    },
  },
  attack_right: {
    imageSrc: "spritesheet/reaper-right/attacking.png",
    frames: {
      x: 6,
      y: 1,
    },
    hitFrame: 4,
    attackHitBox: {
      dir: 1,
      width: 50,
      height: 100,
    },
  },
  dead: {
    imageSrc: "spritesheet/reaper-right/death.png",
    frames: {
      x: 20,
      y: 1,
    },
  },
}

const enemies = [
  new Enemy({
    position: {
      x: 500,
      y: canvas.height - 500,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites    
  }),
  new Enemy({
    position: {
      x: 2800,
      y: canvas.height - 500,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites    
  }),
  new Enemy({
    position: {
      x: 2500,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites
  }),
  new Enemy({
    position: {
      x: 3500,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites
  }),
  new Enemy({
    position: {
      x: 4000,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites
  }),
  new Enemy({
    position: {
      x: 4900,
      y: canvas.height - tileSize - 150 - 100,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites
  }),
  new Enemy({
    position: {
      x: 5500,
      y: canvas.height - tileSize - 150 - 400,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites
  }),
  new Enemy({
    position: {
      x: 5700,
      y: canvas.height - tileSize - 150 - 300,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    imageSrc: "spritesheet/reaper-right/idle.png",
    frames: {
      x: 4,
      y: 1,
    },
    scale: 2,
    offset: {
      x: -60,
      y: -20,
    },
    hitbox: {
      width: 75,
      height: 150,
    },
    sprites: enemySprites
  }),
];

const backgrounds = [
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p1"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p2"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p3"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p4"),
  }),
  new Background({
    x: 0,
    y: 0,
    image: document.getElementById("p5"),
  }),
];

const finishLine = new Finishline ({
  position: {
    x: 5550,
    y: canvas.height - tileSize - 225,
  },
  imageSrc: "spritesheet/blood_moon_tower.png",
  frames: {
    x: 11,
    y: 1
  },
  scale: 1,
  offset: {
    x: 0,
    y: 0
  },
  hitbox: {
    width: 100,
    height: 100
  }

});