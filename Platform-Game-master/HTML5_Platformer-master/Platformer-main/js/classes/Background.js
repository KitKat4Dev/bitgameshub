class Background {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.img = image;
  }
  drawSprite() {
    if (this.position.x + canvas.width > 0) {
      ctx.drawImage(this.img, this.position.x, this.position.y, 1024, 576);
    }
    if(this.position.x + canvas.width < canvas.width) {
        ctx.drawImage(this.img, this.position.x + canvas.width, this.position.y, 1024, 576);
    }
    if(this.position.x > 0){
        ctx.drawImage(this.img, this.position.x - canvas.width, this.position.y, 1024, 576);
    }
  }
  move(num) {
    this.position.x += num;
    console.log("work");
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
