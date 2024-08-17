import { PointsUtils } from "../Utils/Points.js";
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class PalmTree {
    #NUM_POINTS_CURVES;
    #COLOR;

    constructor(NUM_POINTS_CURVES) {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        this.pos_x = -0.6;
        this.pos_y = -3.0;
        //
        this.sx = 0.025;
        this.sy = 0.4;
        //
        this.#COLOR = "brown";
    }

    getGraph() {
        let stemPath = this.#getStemPath();
        let leafOnePath  = this.#getLeafOnePath();
        let leafTwoPath = this.#getLeafTwoPath();

        let palmTreeGraph = {
            transform: {
                dx: this.pos_x, 
                dy: this.pos_y, 
                sx: this.sx, 
                sy: this.sy,
                a: 0 * Math.PI,
            },    
            style: {
                fill: this.#COLOR,
                stroke: this.#COLOR,
                lineWidth: 0.1,
            },    
            
            shape: stemPath,
            children: [

                //
                // LEAVES (6 in total)
                //
                
                // LEAF BOTTOM RIGHT (leaf)
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    
            
                    shape: PointsUtils.reflectAcrossAxis(leafOnePath, {x: 3.12, y: 2.82}, {x: 2.78, y: 2.15}),
                    children: [    
                    ]
                },
                
                // LEAF BOTTOM LEFT (leaf)
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    
            
                    shape: leafOnePath,
                    children: [    
                    ]
                },


                // MIDDLE RIGHT (leaf)
                {
                    transform: {
                        dx: -2.3, 
                        dy: 2, 
                        sx: 1.3, 
                        sy: 0.6,
                        a: -0.2 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    
                    
                    shape: PointsUtils.reflectAcrossAxis(leafOnePath, {x: 3.12, y: 2.82}, {x: 2.78, y: 2.15}),
                    children: [    
                    ]
                },

                // MIDDLE LEFT (leaf)
                {
                    transform: {
                        dx: 0.3, 
                        dy: 0.3, 
                        sx: 0.8, 
                        sy: 0.8,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    
                    
                    shape: leafTwoPath,
                    children: [    
                    ]
                },
                
                
                // UPPER RIGHT (leaf)
                {
                    transform: {
                        dx: -2.7, 
                        dy: 2.3, 
                        sx: 1.5, 
                        sy: 0.7,
                        a: -0.3 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    
            
                    shape: PointsUtils.reflectAcrossAxis(leafOnePath, {x: 3.12, y: 2.82}, {x: 2.78, y: 2.15}),
                    children: [    
                    ]
                },

                // UPPER LEFT (leaf)
                {
                    transform: {
                        dx: 1.9, 
                        dy: -0.7, 
                        sx: 0.7, 
                        sy: 0.8,
                        a: 0.2 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    
            
                    shape: leafTwoPath,
                    children: [    
                    ]
                },


                // "LEAF UNIFIER"
                {
                    transform: {
                        dx: 2.7, 
                        dy: 2, 
                        sx: 0.5, 
                        sy: 0.86,
                        a: -0.1 * Math.PI,
                    },    
                    style: {
                        fill: "green",
                        stroke: "green",
                        lineWidth: 0.1,
                    },    

                    shape: PointsUtils.rect_path(),
                    children: [    
                    ]
                },   
            ],   
        };

        return palmTreeGraph;
    }

    #getStemPath() {
        let stemPath = [];

        // LEFT side
        stemPath = stemPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 2.84, y: 2.83 }, // startPoint
            { x: 3.49, y: 4.15 }, // controlPoint
            { x: 3.09, y: 5.89 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // Bottom
        stemPath = stemPath.concat(PointsUtils.cubicBezierCurve_path(
            { x: 3.09, y: 5.89 }, // startPoint
            { x: 3.08, y: 6.21 }, // controlPoint1
            { x: 4.17, y: 6.21 }, // controlPoint2
            { x: 4.15, y: 5.91 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // RIGHT side
        stemPath = stemPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 4.15, y: 5.91 }, // startPoint
            { x: 4.19, y: 3.49 }, // controlPoint
            { x: 3.34, y: 2.48 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // TOP
        stemPath.push({ x: 2.84, y: 2.83 });

        return stemPath;
    }


    #getLeafOnePath() {
        let leafOnePath = [];
    
        // BOTTOM
        leafOnePath = leafOnePath.concat(PointsUtils.cubicBezierCurve_path(
            { x: 3.07, y: 2.81 }, // startPoint
            { x: 2.59, y: 2.82 }, // controlPoint1
            { x: 1.99, y: 3.82 }, // controlPoint2
            { x: 2.23, y: 4.53 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // Corner
        leafOnePath = leafOnePath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 2.23, y: 4.53 }, // startPoint
            { x: 2.3, y: 4.70 },  // controlPoint
            { x: 2.20, y: 4.68 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // TOP
        leafOnePath = leafOnePath.concat(PointsUtils.cubicBezierCurve_path(
            { x: 2.20, y: 4.68 }, // startPoint
            { x: 1.27, y: 4.02 }, // controlPoint1
            { x: 1.51, y: 2.47 }, // controlPoint2
            { x: 2.28, y: 2.39 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        return leafOnePath;
    }
    
    #getLeafTwoPath() {
        let leafTwoPath = [];
    
        // BOTTOM
        leafTwoPath = leafTwoPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 2.74, y: 2.27 }, // startPoint
            { x: 1.09, y: 2.92 }, // controlPoint
            { x: 0.72, y: 4.04 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        leafTwoPath.push({ x: 0.72, y: 4.22 });
    
        // CORNER
        leafTwoPath = leafTwoPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 0.72, y: 4.22 }, // startPoint
            { x: 0.69, y: 4.33 }, // controlPoint
            { x: 0.60, y: 4.26 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // TOP
        leafTwoPath = leafTwoPath.concat(PointsUtils.cubicBezierCurve_path(
            { x: 0.60, y: 4.26 }, // startPoint
            { x: 0.09, y: 3.72 }, // controlPoint1
            { x: 1.12, y: 1.22 }, // controlPoint2
            { x: 2.62, y: 1.81 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));
    
        // RIGHT SIDE
        leafTwoPath.push({ x: 2.74, y: 2.27 });
    
        return leafTwoPath;
    }
}

