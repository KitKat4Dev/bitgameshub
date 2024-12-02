class Finishline extends Sprite{
    constructor({
        position,
        imageSrc,
        frames,
        scale,
        offset,
        hitbox,
        framesHold
    }){
        super({
            position,
            imageSrc,
            frames,
            scale,
            offset,
            hitbox,
            framesHold,
        })
        this.img = new Image();
        this.img.src = imageSrc;
        this.framesHold = 10;
        // this.img.width = this.img.naturalWidth;
        // this.img.height = this.img.naturalHeight;
    }

    update(){
        this.draw();
        this.animateFrames();
    }

    load(){
        this.img.onload = () => {
            console.log("finish line loaded");
        }
    }


}