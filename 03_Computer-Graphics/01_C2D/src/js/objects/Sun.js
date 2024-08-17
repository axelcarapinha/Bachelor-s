import { PointsUtils } from "../Utils/Points.js";

export class Sun {
    
    constructor() {
        this.color = "orange";
        this.radius = 0.5;
        this.angle = 0.5 * Math.PI;
        this.angleStep = 0.00005 * Math.PI;
    }
    
    update(dt) { 
        this.angle += this.angleStep * dt;
    }

    getGraph(model) {
        return {
            transform: {
                dx: 0.1, 
                dy: 0.1, 
                sx: 0.02, 
                sy: 0.02,
                a: model.sun.angle,
            },    
            style: {
                fill: model.sun.color,
                stroke: model.sun.color,
                lineWidth: 0.3,
            },    
            shape: PointsUtils.star_path(13, 2.4),
            children: [


            ]
        };
    }
}