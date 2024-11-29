const addGravity = (grounded) => {
    let velocity = 0;
    let gravity = 5;
    let gravitySpeed = 0;
    if(!grounded)  {
        gravitySpeed += gravity;
        velocity += gravity;
    }else if(grounded){
        velocity = 0;
    }

    return velocity;
}