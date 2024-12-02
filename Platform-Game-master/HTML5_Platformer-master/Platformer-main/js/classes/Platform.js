class Platform {
  constructor({ position, imageSrc, tiles }) {
    this.position = position;
    this.img = new Image();
    this.img.src = imageSrc;
    this.tileSize = 50;
    this.tiles = tiles;
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
  }
  drawSprite() {

    this.ctx.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.tileSize * this.tiles,
      this.tileSize
    );
  }
  load() {
    this.img.onload = () => {
      console.log("loaded");
    };
  }
  drawBox() {
    // this.ctx.fillStyle = "red";
    // this.ctx.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.tileSize * this.tiles,
    //   tileSize
    // );
  }
}
