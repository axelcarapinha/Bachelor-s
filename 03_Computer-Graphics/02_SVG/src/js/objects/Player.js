import { CalcsUtils } from "../Utils/Calcs.js";
//
import { Character } from "./Character.js";
import { JayMoriarity } from "./JayMoriarity.js";

const PlayerActions = {
    STILL: 0,
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
};

export class Player extends Character {
    #NUM_POINTS_CURVES;

    constructor({size = 0.1, vel = 0.2, pos_x = -1 + 0.1, pos_y = -1 + 0.1, skin = new JayMoriarity({})}) {
        super({size: size, vel: vel, pos_x: pos_x, pos_y: pos_y});
        //
        this.size  = size;
        this.angle = 0;
        this.skin  = skin;
        //
        this.score = 0; 
    }

    update() {
        // Dit NOT use the angles because of the strange effect it made in the animation
        switch (this.action) {
            case PlayerActions.UP:    
                this.pos_y -= this.vel_y; 
                // this.angle = 0.5 * Math.PI; 
                break;
            case PlayerActions.DOWN:  
                this.pos_y += this.vel_y; 
                // this.angle =  0.5 * Math.PI;
                break;
            case PlayerActions.RIGHT: 
                this.sx = -this.size;
                this.pos_x += this.vel_x; 
                // this.angle = 0; 
                break;
            case PlayerActions.LEFT:  
                this.pos_x -= this.vel_x; 
                this.sx = +this.size;
                break;
            case PlayerActions.STILL:
                break;
            default: 
                throw new Error("Invalid state for a player");
        }
        //
        const MIN = -1 + this.size; 
        const MAX = +1 - this.size ;
        this.pos_x = CalcsUtils.clip(this.pos_x, MIN, MAX);
        this.pos_y = CalcsUtils.clip(this.pos_y, MIN, MAX);
    }

    getGraph() { 
        return this.skin.getGraph({
            pos_x: (this.sx < 0) ? this.pos_x + 0.5 : this.pos_x, 
            pos_y: this.pos_y,
            sx: this.sx,
            sy: this.sy, 
            action: this.action,
        });
    }
}