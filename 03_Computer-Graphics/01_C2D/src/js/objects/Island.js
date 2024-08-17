import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
import { PalmTree } from "./PalmTree.js";
//
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class Island {
    #RAND_Y_TRANSLATION;
    #RAND_X_PROPORTION;
    #RAND_Y_PROPORTION;

    #RAND_SPEED_VARIATION;
    #COLOR;
    #NUM_POINTS_CURVES;

    constructor(NUM_POINTS_CURVES) {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        // 0.0 <= RAND_TRANSLATION <= 0.2
        this.#RAND_Y_TRANSLATION = CalcsUtils.rand_ab(0,20) / 100;

        // 0.0 <= RAND_PROPORTION  <= 1.0 
        this.#RAND_X_PROPORTION = this.#RAND_Y_TRANSLATION * 5.0;
        this.#RAND_Y_PROPORTION = this.#RAND_Y_TRANSLATION * 1.5;

        // 0.0 <= RAND_SPEED_VARIATION  <= 1.0 
        this.#RAND_SPEED_VARIATION = this.#RAND_Y_TRANSLATION * 5.0;

        this.pos_x = -1.0;
        this.pos_y = 0.385 + this.#RAND_Y_TRANSLATION;
        this.sx = 0.30 * this.#RAND_X_PROPORTION;
        this.sy = 0.04 * this.#RAND_Y_PROPORTION;
        this.vel_x = 0.000015 * this.#RAND_SPEED_VARIATION;

        this.#COLOR = "yellow";

        this.isHidden = false;
    }

    update(dt) { 
        this.pos_x += this.vel_x * dt; 

        // The ISLAND does NOT appear on the screen anymore
         if (this.pos_x > 1.6) {
            this.isHidden = true;
        }
    }

    getGraph() {
        let sceneGraph = {
            transform: {
                dx: this.pos_x + 0.5, 
                dy: this.pos_y + 0, 
                sx: this.sx, 
                sy: this.sy,
                a: 0 * Math.PI,
            },    
            style: {
                fill: this.#COLOR,
                stroke: this.#COLOR,
                lineWidth: 0.01,
            },    
    
            shape: PointsUtils.pie(PointsUtils.sector_path(this.#NUM_POINTS_CURVES, 0 * Math.PI, -1 * Math.PI)),
            children: [
                
                new PalmTree(this.#NUM_POINTS_CURVES).getGraph(),
                new PalmTree(this.#NUM_POINTS_CURVES).getGraph(),
            ],
        };

        return sceneGraph;
    }
}