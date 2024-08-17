import { Animation } from "./Animation.js";

export class Viewpoint {
    static angle = 0;
    static angleStep = 0.00001 * Math.PI;

    static pos_z = -30;
    static posStep = 0.1;

    constructor({pos_x = 0, pos_y = -0.5, pos_z = 20, orientation = 0 * Math.PI, zNear = "1", zFar = "1000"}) {
        this.id = "viewpoint";

        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.pos_z = pos_z; 
        //
        this.orientation = orientation;
        this.zNear = zNear;
        this.zFar  = zFar;
    }

    getGraph() {
        return {
            tag: "Viewpoint",
            attributes: {
                DEF: `${this.id}`,
                position: `${this.pos_x} ${this.pos_y} ${this.pos_z}`,
                orientation: `1 0 0 ${this.orientation}`,
                // zNear: `${this.zFar}`,
                // zFar: `${this.zNear}`,
                // fieldOfView: "0.5",
                // nearClippingPlane: "-1",
                // isActive: false,
            },
        };
    }

    getAnimationArr({orbitCenter = {x: 0, y: 0, z: 0}}) {
        return Animation.getOrbitArr({
            id: `${this.id}`, 
            orbitCenter: {x: 0, y: 0, z: 0}, 
            orbitPeriod: 49, 
            orbitRadius_x: 20,
            orbitRadius_y: 20, 
            // isEnabled: "true",
        });
    }
}