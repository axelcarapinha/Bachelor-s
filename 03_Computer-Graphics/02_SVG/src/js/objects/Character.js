import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
//
import { GraphicalCtx } from "./../rendering/GraphicalCtx.js";
import { JayMoriarity } from "./JayMoriarity.js";

export class Character {
    #NUM_POINTS_CURVES;

    constructor({pos_x = 0.5, pos_y = 0.5, vel = 0.1, size = 1, skin = new JayMoriarity({}).skin}) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        //
        this.vel = vel;// allow different modes
        this.vel_x = this.vel;
        this.vel_y = this.vel;
        //
        this.size = size;
        this.size = size;
        this.action = 0; // 0: STOP; 1: UP; 2: DOWN; 3: RIGHT; 4: UP
        //
        this.time = 0;
    }
    
    update(dt) { 
       this.pos_x += 1 * dt;
    }

    getGraph() {
        return {
            transform: {
                dx: this.pos_x,
                dy: this.pos_y,
                sx: this.sx,
                sy: this.sy,
                a: 0,
            },
            style: {
                fill: "steelblue",
                stroke: "black",
                lineWidth: 0.01,
            },
            shape: PointsUtils.rect_path(),
            children: [

            ]
        };
    }
}



    
    
    
    
    
    
    




