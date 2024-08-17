import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
//
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class Cloud {
    #RAND_SPEED_VARIATION = 1;
    #CENTER_POINT;
    #NUM_POINTS_CURVES;

    constructor({}) {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        this.#RAND_SPEED_VARIATION = CalcsUtils.rand_ab(7, 10) / 150.0;
        this.#CENTER_POINT = {x: 2.81, y: 2.82};
        this.pos_x = -0.4; 
        this.pos_y = CalcsUtils.rand_ab(0, 2) / 10.0;
        this.sx = CalcsUtils.rand_cr(2.5, 2) / 100.0;
        this.sy = CalcsUtils.rand_cr(2.5, 2) / 100.0;
        this.vel_x = 2E-4 * this.#RAND_SPEED_VARIATION;

        this.radius = 0.1;
        this.angle = (CalcsUtils.rand_cr(10, 9) / 10.0) * Math.PI;
        this.color = "white";

        this.isHidden = false;
    }

    update(dt) { 
        this.pos_x += this.vel_x * dt; 

        // The cloud does NOT appear on the screen anymore
        if (this.pos_x > 1.3) {
            this.isHidden = true;
        }
    }

    getGraph({color = "white"}) {
        let cloudGraph = {
            transform: {
                dx: this.pos_x,
                dy: this.pos_y,
                sx: this.sx,
                sy: this.sy,
                a: 0 * Math.PI,
            },    
            style: {
                fill: color,
                stroke: "grey",
                lineWidth: 0.01,
            },    
            shape: PointsUtils.rotatePoints(this.getPath(), this.angle, this.#CENTER_POINT),
        };

        return cloudGraph;
    }

    getPath() {
        let cloud_path = [];
    
        cloud_path = cloud_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.74, y: 2.35 }, // startPoint
            { x: 1.98, y: 0.13 }, // controlPoint
            { x: 3.18, y: 1.97 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        cloud_path = cloud_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.18, y: 1.97 }, // startPoint
            { x: 4.21, y: 1.64 }, // controlPoint
            { x: 4.07, y: 2.58 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        cloud_path = cloud_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.07, y: 2.58 }, // startPoint
            { x: 5.20, y: 2.95 }, // controlPoint
            { x: 4.18, y: 3.53 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        cloud_path = cloud_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.18, y: 3.53 }, // startPoint
            { x: 3.76, y: 4.07 }, // controlPoint
            { x: 3.03, y: 3.68 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        cloud_path = cloud_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.03, y: 3.68 }, // startPoint
            { x: 2.36, y: 4.18 }, // controlPoint
            { x: 1.82, y: 3.64 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        cloud_path = cloud_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.82, y: 3.64 }, // startPoint
            { x: 0.07, y: 2.92 }, // controlPoint
            { x: 1.74, y: 2.35 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        cloud_path.push({ x: 1.74, y: 2.35 });
    
        return cloud_path;
    }
}