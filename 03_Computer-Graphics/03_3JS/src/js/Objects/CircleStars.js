import { PointsUtils } from "../utils/Points.js";
import { Star } from "./Star.js";
//
import { AnimationTimes } from "../Tools/AnimationTimes.js";

export class CircleStars extends THREE.Group {
    constructor({ numStars = 22, startAngle = 0, endAngle = 2 * Math.PI, radius = 10, size = 1}) {
        super();

        this.numStars = numStars;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.radius = radius;

        this.totalRotTime = 5000; // 5 seconds
        this.angleStep = 0.00005; // betweenStars
        
        // this.angleStep = (2 * Math.PI) / (1000 * 5); // 1000 * 5 seconds; 17 seconds average for dt
        this.starPositions = this.getStarPositions();
        this.getCircleStars({size: size});
        
        //
        // Tween definition
        //
        this.rotate = new TWEEN.Tween(this.rotation)
            .to({ z: 2 * Math.PI}, 1000 * 5)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(AnimationTimes.starsEntrance)
            .repeat(Infinity)
        ;
        
        this.rotate.start();      
    }


    getStarPositions() {
        return PointsUtils.sector_path(this.numStars, this.startAngle, this.endAngle);
    }

    getCircleStars({size = 1}) {
        let angle = this.startAngle;
        for (let i = 0; i < this.numStars; i++) {
            let star = new Star({size: size});

            // Calculate position
            let x_coord = this.starPositions[i].x * this.radius;
            let y_coord = this.starPositions[i].y * this.radius;

            star.position.set(x_coord, y_coord, 5);

            // Calculate rotation
            angle += this.angleStep;
            star.rotation.set(0.5 * Math.PI, 0.2 * Math.PI + angle, 0);
            //
            this.add(star);
        }
    }
}
