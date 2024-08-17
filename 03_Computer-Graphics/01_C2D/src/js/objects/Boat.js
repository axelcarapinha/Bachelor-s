import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
//
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class Boat {
    #RAND_SPEED_VARIATION = 1;
    #NUM_POINTS_CURVES;
    
    constructor() {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        this.#RAND_SPEED_VARIATION = CalcsUtils.rand_ab(0, 10) / 10.0;

        this.pos_x = -0.6;
        this.pos_y = CalcsUtils.rand_cr(0, 2) / 10.0;
        this.sx = CalcsUtils.rand_cr(2.5, 2) / 100.0;
        this.sy = CalcsUtils.rand_cr(2.5, 2) / 100.0;
        this.vel_x = 0.0007 * this.#RAND_SPEED_VARIATION;
        this.radius = 0.1;
        this.angle = (CalcsUtils.rand_cr(10, 9) / 10.0) * Math.PI;
    }

    getGraph(model) {
        return {
            transform: {
                dx: model.leader.x, 
                dy: model.leader.y, 
                sx: model.leader.sx, 
                sy: model.leader.sy,
                a: model.leader.rotationAngle,
            },
            style: {
                fill: model.leader.color,
                stroke: "white",
                lineWidth: 0.05,
            },
            shape: this.#getBasicBoatPath(),
            children: [

                // Hull decoration
                {
                    transform: {
                        dx: 1, 
                        dy: 1, 
                        sx: 0.6, 
                        sy: 0.6,
                        a: 0
                    },
                    style: {
                        fill: `hsl(60, 100%, 50%)`,
                        stroke: "white",
                        lineWidth: 0.01,
                    },
                    shape: this.#getHullDecoration(),
                    
                    children: [

                        // L-system CUSTOMISED decoration
                        {
                            transform: {
                                dx: 1.4, 
                                dy: 2.5, 
                                sx: 0.1, 
                                sy: 0.1,
                                a: -0.03 * Math.PI,
                            },    
                            style: {
                                stroke: "black",
                                lineWidth: 0.3,
                            },    
                            shape: PointsUtils.AxelLsystPath()
                            
                        },
                    ]
                },

                // STERN
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0
                    },
                    style: {
                        fill: `hsla(60, 100%, 46%, 1)`, // yellow
                        stroke: "white",
                        lineWidth: 0.05,
                    },
                    shape: this.#getSternPath(),
                    children: [

                    ]
                },

                // KEEL
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0
                    },
                    style: {
                        fill: "skyblue",
                        stroke: "white",
                        lineWidth: 0.05,
                    },
                    shape: this.#getKeelPath(),
                },

                // Line of the STERN
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0
                    },
                    style: {
                        stroke: "white",
                        lineWidth: 0.05,
                    },
                    shape: [
                        {x: 4.90, y: 1.48},
                        {x: 5.20, y: 2.3}
                    ],
                },

                // Window
                {
                    transform: {
                        dx: 0, 
                        dy: 0, 
                        sx: 1, 
                        sy: 1,
                        a: 0
                    },
                    style: {
                        fill: `hsla(168, 61%, 63%, 0.5)`, // transparent blue
                        stroke: "white",
                        lineWidth: 0.05,
                    },
                    shape: this.#getWindowPath(),
                    children: [

                    ]
                },

                //
                // Captain
                //
                model.leader.getGraph(),
            ]
        };
    }

    #getKeelPath() {
        return [
            {x: 2.40, y: 1.48},
            {x: 4.90, y: 1.48},
            {x: 5.94, y: 2.37},
            {x: 2.82, y: 1.91},
            {x: 2.40, y: 1.48},
        ];
    }

    #getWindowPath() {
        let windowPath = [];

        windowPath.push(
            {x: 2.38, y: 1.47}, 
            {x: 2.82, y: 1.90},
            {x: 3.29, y: 1.97},
            {x: 3.30, y: 1.04},
        );

        windowPath = windowPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 3.30, y: 1.04 }, // startPoint
            { x: 2.89, y: 1.05 }, // controlPoint
            { x: 2.38, y: 1.47 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        return windowPath;
    }

    #getSternPath() {
        return [
            {x: 0.01, y: 1.49}, 
            {x: 2.82, y: 1.91},
            {x: 2.40, y: 1.48},
            {x: 0.01, y: 1.49},
        ];
    }

    #getBasicBoatPath() {

        let basicBoatPath = [];

        basicBoatPath = basicBoatPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 0.01, y: 1.49 }, // startPoint
            { x: 0.80, y: 2.76 }, // controlPoint
            { x: 2.65, y: 3.42 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        basicBoatPath.push(
            {x: 6.25, y: 3.42},
            {x: 5.94, y: 2.37},
            {x: 0.01, y: 1.49}
        );
    
        return basicBoatPath;
    }

    #getHullDecoration() {
        let decorationPath = [];

        let boatPath = this.#getBasicBoatPath();
        boatPath.splice(
            (boatPath.length - 1) - 1, // startIndex
            0, // num elements to remove
            {x: 2.00, y: 2.64} // point to ADD
        );

        return [...boatPath];
    }
}