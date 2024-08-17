export class Camera extends THREE.PerspectiveCamera {
    constructor({posToLook = {x: 0, y: 0, z: 0}, pos_x = 0, pos_y = 0, pos_z = 0}) {
        super (
            70, // abertura
            512 / 512, // proporÃ§Ã£o largura/altura 
            0.01, // corte perto
            10000 // corte longe)
        );
        //
        this.position.set(pos_x, pos_y, pos_z);
        this.lookAt(posToLook);

        //
        // Defining the TWEENs (for the initial movement of the camera)
        //
        this.goLeft = new TWEEN.Tween(this.position)
        // .onStart(() => this.position.set(0,30,110))
            .to({x: pos_x - 500, y: pos_y - 40, z: pos_z + 30}, 1000 * 5)
            .easing(TWEEN.Easing.Quadratic.InOut)
            // .delay(1000 * 4)
        ;

        this.goDown = new TWEEN.Tween(this.position)
        // .onStart(() => this.position.set(0,30,110))
            .to({ z: this.position.z - 50}, 1000 * 2)
            .easing(TWEEN.Easing.Quadratic.InOut)
            // .delay(1000 * 4)
        ;

        this.goCenter = new TWEEN.Tween(this.position)
        // .onStart(() => this.position.set(0,30,110))
            .to({x: -5, y:-200, z: 30}, 1000 * 3)
            .easing(TWEEN.Easing.Quadratic.InOut)
            // .delay(1000 * 4)
        ;

        this.goLeft.chain(this.goDown);
        this.goDown.chain(this.goCenter);

        this.goLeft.start();
    }
}
