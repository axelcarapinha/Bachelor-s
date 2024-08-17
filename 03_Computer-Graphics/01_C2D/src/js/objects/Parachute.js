import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
//
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class Parachute {
    #CENTER_POINT;
    #NUM_POINTS_CURVES;
    #centerTopPoint;
    #centerBottomPoint;
    #color;
    #nagonNumSides;

    constructor(color, nagonNumSides, NUM_POINTS_CURVES) {
        this.#color = color;
        this.#nagonNumSides = nagonNumSides;
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        this.pos_x = -5.5;
        this.pos_y = -10;
        this.sx = 1.2 * 2;
        this.sy = 1.0 * 2;

        this.#centerTopPoint    = {x: 1.99, y: 5.60};
        this.#centerBottomPoint = {x: 3.59, y: 0.26};


        this.#CENTER_POINT = {x: 2.81, y: 2.82};
    }

    getGraph() {
        let rightHalf = this.#getRightHalfPath();
        let chordsPaths = this.#getChordsPaths();

        let simpleElipse = [];
        simpleElipse = simpleElipse.concat(
            PointsUtils.elipse_path(
                CalcsUtils.dist({x: 3.10, y: 4.19}, 
                     {x: 3.29, y: 3.53}),
                CalcsUtils.dist({x: 2.92, y: 3.81}, 
                     {x: 3.47, y: 3.98}),
                this.#NUM_POINTS_CURVES
            )
        );
    
        let graph = {

            // Parachute's RIGHT half
            transform: {
                dx: this.pos_x, 
                dy: this.pos_y, 
                sx: this.sx, 
                sy: this.sy,
                a: 0,
            },
            style: {
                fill: "green",
                stroke: "white",
                lineWidth: 0.05,
            },
            shape: rightHalf,

            children: [

                // LEFT chord
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "grey",
                        stroke: "white",
                        lineWidth: 0.03,
                    },

                    shape: chordsPaths[0],
                },

                // MIDDLE chord
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "grey",
                        stroke: "white",
                        lineWidth: 0.03,
                    },

                    shape: chordsPaths[1],
                },

                // RIGHT chord

                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "grey",
                        stroke: "white",
                        lineWidth: 0.03,
                    },

                    shape: chordsPaths[2],
                },

                //
                // Parachute's LEFT half
                // 
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "red",
                        stroke: "white",
                        lineWidth: 0.03,
                    },

                    shape: PointsUtils.reflectAcrossAxis(rightHalf, {x: 1.99, y: 5.60},{x: 3.59, y: 0.26}),
                    children: [

                        // Parachute's (N-Agon) decoration
                        {
                            transform: {
                                dx: 3, 
                                dy: 2.2, 
                                sx: 0.5, 
                                sy: 0.5,
                                a: 0.23 * Math.PI,
                            },
                            style: {
                                fill: this.#color,
                                stroke: "white",
                                lineWidth: 0.03,
                            },
                            shape: PointsUtils.nagon_path(this.#nagonNumSides),

                        },
                    ]
                },

                // RIGHT chord
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "grey",
                        stroke: "white",
                        lineWidth: 0.03,
                    },

                    shape: PointsUtils.reflectAcrossAxis(chordsPaths[0], {x: 1.99, y: 5.60},{x: 3.59, y: 0.26}),
                },

                // MIDDLE chord
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "grey",
                        stroke: "white",
                        lineWidth: 0.03,
                    },
                    shape: PointsUtils.reflectAcrossAxis(chordsPaths[1], {x: 1.99, y: 5.60},{x: 3.59, y: 0.26}),

                },

                // LEFT chord
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0,
                    },
                    style: {
                        fill: "grey",
                        stroke: "white",
                        lineWidth: 0.03,
                    },

                    shape: PointsUtils.reflectAcrossAxis(chordsPaths[2], {x: 1.99, y: 5.60},{x: 3.59, y: 0.26}),
                },

            ]
        }

        return graph;
    }

    #getRightHalfPath() {
        let rightHalfPath = [];

        // Curve 1
        rightHalfPath = rightHalfPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.11, y: 2.63 },  // startPoint
            { x: 1.48, y: 2.54 },  // controlPoint
            { x: 2.83, y: 2.84 },  // endPoint
            this.#NUM_POINTS_CURVES
        ));

        // Central part
        rightHalfPath.push({x: 3.25, y: 1.63});

        // Curve 2
        rightHalfPath = rightHalfPath.concat(PointsUtils.cubicBezierCurve_path(
            { x: 3.25, y: 1.63 }, // startPoint
            { x: 2.26, y: 1.36 }, // controlPoint1
            { x: 1.07, y: 1.99 }, // controlPoint2
            { x: 1.11, y: 2.63 }, // endPoint
            this.#NUM_POINTS_CURVES));

        rightHalfPath.push({ x: 1.11, y: 2.63 });

        return rightHalfPath;
    }


    #getChordsPaths() {
        let chordsPaths = [];

        let chord1Path = [
            {x: 1.10, y: 2.63 },
            {x: 2.15, y: 4.75 },
            {x: 2.22, y: 4.69 },
            {x: 1.21, y: 2.61 },
            {x: 1.10, y: 2.63 },
        ];
    
        let chord2Path = [
            {x: 1.57, y: 2.61 },
            {x: 2.23, y: 4.69 },
            {x: 2.30, y: 4.67 },
            {x: 1.68, y: 2.62 },
            {x: 1.57, y: 2.61 },
        ];
       
        let chord3Path = [
            {x: 2.09, y: 2.67 },
            {x: 2.27, y: 4.70 },
            {x: 2.36, y: 4.70 },
            {x: 2.19, y: 2.67 },
            {x: 2.09, y: 2.67 },
        ];
    
        chordsPaths.push(
            chord1Path,
            chord2Path,
            chord3Path
        );
        
        return chordsPaths;
    }
} 
 
 