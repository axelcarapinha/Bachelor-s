import { PointsUtils } from "../Utils/Points.js";
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";
export class Pacman {
    #NUM_POINTS_CURVES;

    constructor() {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;
        this.color = `hsl(55, 100%, 50%)`; // Pacman's yellow
    }

    getGraph ({pos_x = 0.2, pos_y = 0.3, sx = 0.12, sy = 0.12, action = 1, angle = 0}) {
        return {
            transform: {
                dx: pos_x,
                dy: pos_y,
                sx: sx,
                sy: sy,
                a: angle,
            },
            style: {
                fill: this.color, 
                stroke: "black",
                lineWidth: 0.04,
            },
            shape: PointsUtils.pie(PointsUtils.sector_path(this.#NUM_POINTS_CURVES, 0.20 * Math.PI, 1.8 * Math.PI)),
            children: [
                {
                    transform: {
                        dx: 0,
                        dy: 0,
                        sx: 1,
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: this.color,
                        stroke: "black",
                        lineWidth: 0.04,
                    },
                    shape: PointsUtils.pie(PointsUtils.sector_path(this.#NUM_POINTS_CURVES, 0.20 * Math.PI, 1.8 * Math.PI)),
                },
            

                // Eye
                { 
                    transform: {
                    dx: 0.3,
                    dy: -0.6,
                    sx: 0.15,
                    sy: 0.15,
                    a: 1 * Math.PI,
                    },
                    shape: PointsUtils.pie(PointsUtils.sector_path(this.#NUM_POINTS_CURVES, 0.20 * Math.PI, 1.8 * Math.PI)),
                    style: {
                        fill: "black",
                        stroke: "black",
                        lineWidth: 0.04,
                    }
                },
            

                // Mouth
                { 
                    transform: {
                    dx: 0.02,
                    dy: -0.01,
                    sx: 1,
                    sy: 1,
                    a: 0.019 * Math.PI,
            
                    } ,
                    shape: PointsUtils.pie(PointsUtils.sector_path(this.#NUM_POINTS_CURVES, 0.15 * Math.PI, 0.2 * Math.PI)),
                    style: {
                    fill: "black",
                    stroke: "black",
                    lineWidth: 0.01,
                    }
                },                
            ],
        };
      
    }
}