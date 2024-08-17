export class SpotLight extends THREE.SpotLight {
    constructor({pos_x = 0, pos_y = 0, pos_z = 0}) {
        super( 
            0xFFFFFF, // color
            3, // intensity
            0, // distance
            0.3 * Math.PI, // angle
            200, // decay
        );
    
        this.position.set(pos_x,pos_y, pos_z);
        this.castShadow = true;
        this.shadow.camera.near = 1;
        this.lookAt(50,80,70);
    }
}