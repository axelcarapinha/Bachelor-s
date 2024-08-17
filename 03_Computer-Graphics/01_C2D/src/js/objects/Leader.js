import { PointsUtils } from "../Utils/Points.js";
import { Boat } from "./Boat.js";
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class Leader {
    #angleStep = 0.0;
    #color = "";
    #eyesDist = 0;
    #NUM_POINTS_CURVES = 0;
    #pigmentation = "";

    constructor({x = 1.4, y = 0.5, size = 0.08, rot_ang = 0, vehicle = new Boat()}) {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        this.x = x;
        this.y = y;
        this.size = size; // useful to make the symetrical boat when going to the right
        this.sx = size;
        this.sy = size;
        this.rotationAngle = rot_ang;
        this.vehicle = vehicle;

        this.goingLeft = false;
        this.#angleStep = 0.1;
        this.#color = "steelblue";
        this.#pigmentation = `hsl(11, 65%, 78%)`;
        this.#eyesDist = -0.16;

        //
        // Leader PLANING (and not PLOWING)
        //
        this.headUp = new TWEEN.Tween(this)
            .to({rotationAngle: this.rotationAngle + this.#angleStep}, 1000 * 4)
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;

        this.headDown = new TWEEN.Tween(this)
            .to({rotationAngle: this.rotationAngle}, 1000 * 4) 
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;

        this.goUp = new TWEEN.Tween(this)
            .to({y: this.y - 0.05}, 1000 * 4)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {this.headDown.start();}
        );
        //
        this.goDown = new TWEEN.Tween(this)
            .to({y: this.y}, 1000 * 4)
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;

        //
        // Translations
        //
        this.goRight = new TWEEN.Tween(this)
            .to({x: 1.5}, 1000 * 10) 
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;
        this.goLeft = new TWEEN.Tween(this)
            .to({x: -1.5}, 20000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(1000 * 2)
        ;
        this.stayCenter = new TWEEN.Tween(this)
            .to({x: 0.6}, 1000 * 8)
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;

        // Chain
        this.headUp.chain(this.headDown);
        this.headDown.chain(this.headUp);
        //
        this.goUp.chain(this.goDown);
        this.goDown.chain(this.goUp);
        //
        this.goLeft.chain(this.stayCenter);
        this.stayCenter.chain(this.goRight);
        this.goRight.chain(this.goLeft);

        // Start 
        this.goLeft.start();   
        this.goUp.start();
        this.headUp.start();
    }

    getGraph() {
        return {
            // Chest (shirt)
            transform: {
                dx: 0, 
                dy: 0, 
                sx: 1,
                sy: 1,
                a: 0
            },
            style: {
                fill: `hsl(120, 100%, 35%)`,
                stroke: "grey",
                lineWidth: 0.005,
            },
            shape: this.#getChestPath(),
            children: [
                this.#getArmGraph(),
                this.#getHairGraph(), // includes the head
            ]
        };
    }

    #getHairGraph() {
        let hairGraph = {};

        let hairPath = this.#getHairPath();
        hairGraph = {
            transform: {
                dx: 0.21, 
                dy: 0.3, 
                sx: 1, 
                sy: 1,
                a: 0
            },
            style: {
                fill: "yellow",
                stroke: "white",
                lineWidth: 0.01,
            },
            shape: hairPath,
            children: [
                this.#getHeadGraph(),
            ]
        };

        return hairGraph;
    }


    #getArmGraph() {
        return {

            // Arm
            transform: {
                dx: 0, 
                dy: 0, 
                sx: 1, 
                sy: 1,
                a: 0
            },
            style: {
                fill: `hsl(120, 100%, 30%)`, // dark green
                stroke: `hsl(120, 100%, 50%)`,
                lineWidth: 0.01,
            },
            shape: this.#getArmPath(),
            children: [
                
                // Hand
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0
                    },
                    style: {
                        fill: this.#pigmentation,
                        stroke: this.#pigmentation,
                        lineWidth: 0.01,
                    },
                    shape: this.#getHandPath(),
                    children: [ 
                    ]
                    
                },
            ]
        };
    }

    #getHeadGraph() {
        return {
            transform: {
                dx: -0.21, 
                dy: -0.27, 
                sx: 1, 
                sy: 1,
                a: 0
            },
            style: {
                fill: this.#pigmentation,
                stroke: this.#pigmentation,
                lineWidth: 0.01,
            },
            shape: this.#getHeadPath(),
            children: [

                // Static to reuse in the follower graph
                Leader.getEyeGraph({offset: 0 * this.#eyesDist}), 
                Leader.getEyeGraph({offset: 1 * this.#eyesDist}),

                // Ear
                {
                    transform: {
                        dx: 4, 
                        dy: 5, 
                        sx: 1, 
                        sy: 1,
                        a: -0.55 * Math.PI
                    },
                    style: {
                        fill: this.#pigmentation,
                        stroke: "black",
                        lineWidth: 0.01,
                    },
                    shape: this.#getEarPath(),
                    // shape: urect(),
                    children: []
                },

                // Mouth
                {
                    transform: {
                        dx: -0.01, 
                        dy: -0.0, 
                        sx: 1, 
                        sy: 1,
                        a: 0 * Math.PI
                    },
                    style: {
                        fill: "black",
                        stroke: this.#pigmentation,
                        lineWidth: 0.01,
                    },
                    shape: this.#getMouthPath(),
                    // shape: urect(),
                    children: []
                }
            ]
        };
    }

    static getEyeGraph({pos_x = 3.57, pos_y = 0.7, sx = 0.08, sy = 0.1, a = -0.5 * Math.PI, color = "steelblue", offset = 0.5}) {
        return {
            // EYE'S sclera
            transform: {
                dx: pos_x + offset,
                dy: pos_y, 
                sx: sx, 
                sy: sy, 
                a: a,
            },
            style: {
                fill: "white",
                stroke: "grey",
                lineWidth: 0.1,
            },
            shape: PointsUtils.circle_path(),
            children: [

                // Inner part
                {
                    // EYE'S iris
                    transform: {
                        dx: -0.1, 
                        dy: -0.3, 
                        sx: 0.5, 
                        sy: 0.5,
                        a: -0.5 * Math.PI,
                    },
                    style: {
                        fill: color,
                        lineWidth: 0.05,
                    },
                    shape: PointsUtils.circle_path(),
                    children: [
                        {
                        // EYE'S pupil
                        transform: {
                            dx: 0, 
                            dy: 0, 
                            sx: 0.6, 
                            sy: 0.6, 
                            a: -0.5 * Math.PI,
                        },
                        style: {
                            fill: "black",
                            lineWidth: 0.05,
                        },
                        shape: PointsUtils.circle_path(),
                        },
                    ]
                },
            ]
        };
    }

    #getChestPath() {
        let chestPath = [];

        chestPath.push(
            {x: 3.67, y: 2.02}, 
            {x: 4.18, y: 2.10},
            {x: 4.14, y: 1.42},
            {x: 3.79, y: 1.43},
        );

        return chestPath;
    }

    #getEarPath() {
        let earPath = [];

        // LEFT part
        earPath = earPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.12, y: 0.68 }, // startPoint
            { x: 4.2, y: 0.56 },  // controlPoint
            { x: 4.27, y: 0.73 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // RIGHT part
        earPath = earPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.27, y: 0.73 }, // startPoint
            { x: 4.17, y: 0.64 }, // controlPoint
            { x: 4.12, y: 0.68 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        earPath.push({ x: 4.12, y: 0.68 });

        return earPath;
    }

    #getArmPath() {
        let armPath = [];

        // Shirt-sleeve
        armPath = armPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.49, y: 1.75 }, // startPoint
            { x: 3.50, y: 1.82 }, // controlPoint
            { x: 3.49, y: 1.92 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        armPath.push({ x: 3.74, y: 1.91 });

        // Elbow
        armPath = armPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.74, y: 1.91 }, // startPoint
            { x: 3.81, y: 1.91 }, // controlPoint
            { x: 3.85, y: 1.86 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        armPath.push({ x: 4.04, y: 1.65 });

        // Shoulder
        armPath = armPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.04, y: 1.65 }, // startPoint
            { x: 4.05, y: 1.51 }, // controlPoint
            { x: 3.93, y: 1.55 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
        // Shoulder
        armPath = armPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.04, y: 1.65 }, // startPoint
            { x: 4.05, y: 1.51 }, // controlPoint
            { x: 3.93, y: 1.55 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        armPath.push({ x: 3.93, y: 1.55 });

        return armPath;
    }

    #getHandPath() {
        let handPath = [];

        // Thumb
        handPath = handPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.49, y: 1.76 }, // startPoint
            { x: 3.42, y: 1.69 }, // controlPoint
            { x: 3.32, y: 1.75 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        handPath.push({ x: 3.32, y: 1.94 });

        // Other part of the hand
        handPath = handPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.32, y: 1.94 }, // startPoint
            { x: 3.39, y: 1.98 }, // controlPoint
            { x: 3.49, y: 1.91 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        return handPath;
    }

    #getHeadPath() {
        let headPath = [];

        // Neck
        headPath.push(
            { x: 4.15, y: 1.41 },
            { x: 4.15, y: 1.15 },
        );

        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.15, y: 1.15 }, // startPoint
            { x: 4.07, y: 1.09 }, // controlPoint
            { x: 4.02, y: 0.99 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // Ears Auricle
        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.02, y: 0.99 }, // startPoint
            { x: 4.30, y: 0.58 }, // controlPoint
            { x: 4.00, y: 0.62 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // Head's temple
        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.00, y: 0.62 }, // startPoint
            { x: 3.93, y: 0.65 }, // controlPoint
            { x: 3.91, y: 0.76 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        headPath.push({ x: 3.87, y: 0.76 });

        // Head's top
        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.87, y: 0.76 }, // startPoint
            { x: 3.85, y: 0.36 }, // controlPoint
            { x: 3.41, y: 0.50 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // Forehead
        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.41, y: 0.50 }, // startPoint
            { x: 3.36, y: 0.63 }, // controlPoint
            { x: 3.40, y: 0.79 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // Nose
        headPath.push({ x: 3.30, y: 0.89 });

        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.30, y: 0.89 }, // startPoint
            { x: 3.28, y: 0.95 }, // controlPoint
            { x: 3.34, y: 0.98 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        headPath.push({ x: 3.40, y: 0.98 });

        // Mouth
        headPath.push(
            { x: 3.42, y: 1.06 },
            { x: 3.61, y: 1.04 },
            { x: 3.45, y: 1.14 },
        );

        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.45, y: 1.14 }, // startPoint
            { x: 3.45, y: 1.16 }, // controlPoint
            { x: 3.49, y: 1.17 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // Chin
        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.49, y: 1.17 }, // startPoint
            { x: 3.45, y: 1.16 }, // controlPoint
            { x: 3.77, y: 1.28 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.77, y: 1.28 }, // startPoint
            { x: 3.81, y: 1.35 }, // controlPoint
            { x: 3.79, y: 1.43 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.79, y: 1.43 }, // startPoint
            { x: 3.77, y: 1.38 }, // controlPoint
            { x: 4.15, y: 1.42 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));


        headPath = headPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.45, y: 1.14 }, // startPoint
            { x: 3.45, y: 1.16 }, // controlPoint
            { x: 3.49, y: 1.17 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));


        return headPath;
    }

    #getHairPath() {
        let hairPath = [];
    
        // First segment
        hairPath = hairPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.37, y: 0.39 }, // startPoint
            { x: 4.00, y: 1.36 }, // controlPoint
            { x: 4.24, y: 0.40 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
        
        // Second segment
        hairPath = hairPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.24, y: 0.40 }, // startPoint (end of previous segment)
            { x: 4.3, y: -0.2 }, // controlPoint
            { x: 3.34, y: -0.05 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
        
        // Third segment
        hairPath = hairPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.34, y: -0.05 }, // startPoint (end of previous segment)
            { x: 2.9, y: 0.08 }, // controlPoint
            { x: 3.37, y: 0.36 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        return hairPath;
    }

    #getMouthPath() {
        let mouthPath = [];
        
        mouthPath = mouthPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.61, y: 1.04 }, // startPoint
            { x: 3.48, y: 1.06 }, // controlPoint
            { x: 3.45, y: 1.14 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        return mouthPath;
    }
}