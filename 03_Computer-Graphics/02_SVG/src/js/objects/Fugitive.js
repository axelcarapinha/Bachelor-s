import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
//
import { Character } from "./Character.js";
import { ChappelBones } from "./ChappelBones.js";

const FugitiveStates = {
    WANDER: 1,
    RUN: 2,
    HUNTED: 3,
};

export class Fugitive extends Character {
    #NUM_POINTS_CURVES;

    constructor({size = 0.1, color = "yelllow", pos_x = -1 + 0.1, pos_y = -1 + 0.1, vel = 0.1, maxCorneredTime = 3, playerReach = 3, skin = new ChappelBones({}), arenaSize = 1}) {
        super({size: size, color: color, pos_x: pos_x, pos_y: pos_y, vel: vel});
         
        this.skin  = skin;
        this.size  = size;
        this.angle = 0;
        
        // POSITION calculations
        this.heading = 0;
        this.vel_x = vel;
        this.vel_y = vel;
        
        // STATE calculations
        this.state = 0;
        this.isHunted = false;
        this.huntedDist = arenaSize * 0.00008 * playerReach; // the capacity to reach of the player

        // Keeps the decision of escaping from a corner for a while
        this.lastPosition = {x: 0, y: 0};
        this.isCornered = false;
        this.corneredTime = 0;
        this.maxCorneredTime = maxCorneredTime;
        
        this.pos_x = CalcsUtils.rand_ab(-1 + 0.1, 1 - 0.1);
        this.pos_y = CalcsUtils.rand_ab(-1 + 0.1, 1 - 0.1);
    }
    
    update(model, dt) { 
        //
        // COLLECT data
        //
        this.lastPosition = {x: this.pos_x, y: this.pos_y};

        //
        // (1 / 3) MEASURE and DECIDE
        //
        let d = Math.abs(CalcsUtils.dist(  // absolute because the heading already indicates the direction
            {x: this.pos_x, y: this.pos_y}, 
            {x: model.player.pos_x, y: model.player.pos_y}
        ));
        //
        if (d <= model.safeDistance) {
            this.state = (d <= this.huntedDist) ? FugitiveStates.HUNTED : FugitiveStates.RUN;
        }
        else {
            this.state = FugitiveStates.WANDER;
            this.isCornered = false;
        }

        //
        // (2 / 3) CALCULATE
        //
        switch (this.state) {
            case FugitiveStates.WANDER: 
                this.vel_x = 1 * model.maxVel;
                this.vel_y = 1 * model.maxVel;
                this.isCornered = false;
                this.corneredTime = 0;
                this.heading += 0.1 * Math.PI * CalcsUtils.rand_ab(-1,1);                
                break;
            case FugitiveStates.RUN: 

                // Measure angle from this to the Player
                this.heading = Math.atan2( // atan2 to get the angle from the value
                    model.player.pos_y - this.pos_y, // yy difference (SINs difference)
                    model.player.pos_x - this.pos_x  // xx difference (COSs difference)
                    // tan^-1 (finalSin / finalCos)
                );

                if (this.lastPosition.x === this.pos_x
                    && this.lastPosition.y === this.pos_y) { // less precision, but it embetters the logic

                    // CORNERED STATE
                    this.corneredTime++;

                    if (this.corneredTime >= this.maxCorneredTime) {
                        this.corneredTime = 0;
                        // this.corneredTime-= 20;

                        // BOTTOM RIGHT 
                        if (this.pos_y > 0 && this.pos_x > 0.3) { 
                            // Player at its TOP
                            if (this.heading <= -0.4 * Math.PI &&
                                this.heading >= -0.6 * Math.PI) {
                                this.heading = 0 * Math.PI; // goes to the LEFT
                            }
                            // Player is at its LEFT
                            else {
                                this.heading = 0.5 * Math.PI;
                            }  
                        }

                        // BOTTOM LEFT
                        else if (this.pos_y > 0 && this.pos_x < 0.3) {
                            // Player at its TOP
                            if (this.heading <= -0.4 * Math.PI &&
                                this.heading >= -0.6 * Math.PI) {
                                this.heading = 1 * Math.PI;
                            }
                            // Player is at its RIGHT
                            else {
                                this.heading = 0.5 * Math.PI;
                            }  
                        }

                        // UPPER RIGHT
                        else if (this.pos_y < 0 && this.pos_x > 0.3) { 
                            // Player at its BOTTOM
                            if (this.heading >= +0.4 * Math.PI &&
                                    this.heading <= +0.6 * Math.PI) {
                                this.heading = 0 * Math.PI;
                            }
                            // Player is at its LEFT
                            else {
                                this.heading = -0.5 * Math.PI;
                            }
                        }

                        // UPPER LEFT
                        else if (this.pos_y < 0 && this.pos_x < 0.3) { 
                            // Player at its BOTTOM
                            if (this.heading >= +0.4 * Math.PI &&
                                this.heading <= +0.6 * Math.PI) {
                                this.heading = 1 * Math.PI;
                            }
                            // Player is at its RIGHT
                            else {
                                this.heading = -0.5 * Math.PI;
                            }
                        } 
                    }
                }

                //
                // Calculate the SPEED
                //
                this.vel_x = 0.5 * model.maxVel;
                this.vel_y = 0.5 * model.maxVel;

                break;
            case FugitiveStates.HUNTED: this.isHunted = true; return; 
            case FugitiveStates.FLIGHT_MODE: this.corneredTime--; break;
            default: throw new Error("Invalid state for a fugitive");
        }

        //
        // MOVE
        //
        let vel_x = this.vel * Math.cos(this.heading); //TODO voltar a arranjar este dt
        let vel_y = this.vel * Math.sin(this.heading);

        // Limit the movement to the arena size
        const MIN = -1 + this.size; 
        const MAX = +1 - this.size;
        this.pos_x = CalcsUtils.clip(this.pos_x - vel_x, MIN, MAX);
        this.pos_y = CalcsUtils.clip(this.pos_y - vel_y, MIN, MAX);
    }

    getGraph() {
        //
        // Turn to the side that it is going
        //

        // going to the RIGHT
        if (this.heading >= -0.25 * Math.PI &&  
            this.heading < +0.25 * Math.PI) {
            // this.angle = 0; // did NOT update the angles because of the strange effect it gave to the game
            this.sx = -this.size; 
        }

        // going UP
        else if(this.heading >= 0.25 * Math.PI &&
                this.heading <  0.75 * Math.PI) {
                // this.angle = -0.5 * Math.PI;
        }

        // going to the LEFT
        else if (this.heading >= 0.75 &&
            this.heading <  1.25 * Math.PI){
            // this.angle = 0;
            this.sx = +this.size; 
        }

        // going DOWN
        else {
            // this.angle = +0.5 * Math.PI;
        }

        //
        // Render the image accordingly
        //
        return this.skin.getGraph({
            pos_x: this.pos_x, 
            pos_y: this.pos_y,
            sx: this.sx, 
            sy: this.sy,
            angle: this.angle,
        });
    }
}



    
    
    
    
    
    
    




