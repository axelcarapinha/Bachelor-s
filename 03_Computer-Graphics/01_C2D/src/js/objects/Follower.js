import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
import { Parachute } from "./Parachute.js";
//
import { Leader } from "./Leader.js";
import { GraphicalCtx } from "../rendering/GraphicalCtx.js";

export class Follower {
    #speed = 0.0;
    #lastTraveledDist = 0.1;
    //
    #pigmentation = "";
    #mouthColor = "";
    #skinBorderColor = ";"
    #NUM_POINTS_CURVES;
    
    constructor ({x = 1.4, y = 0.1, size = 0.0025}) {
        this.#NUM_POINTS_CURVES = GraphicalCtx.NUM_POINTS_CURVES;

        this.x = x;
        this.y = y;
        this.first_pos_y = y;

        this.size = size;
        this.sx = size;
        this.sy = size;

        this.parachute = new Parachute(
            `hsl(${Math.round(CalcsUtils.rand_ab(0, 360))}, 100%, 50%)`, // randomColor
            Math.round(CalcsUtils.rand_ab(3,7)), //nagonNumSides 
            this.#NUM_POINTS_CURVES
        );
            
        this.#speed = 0.001;
        this.#lastTraveledDist;

        this.#pigmentation = `hsl(11, 65%, 90%)`; 
        this.#mouthColor = `hsl(11, 65%, 85%)`; 
        this.#skinBorderColor = `hsl(11, 65%, 75%)`;
            
        this.eyeSize = 3.5;
        this.eyesOffset = 1.5;
    }

    update(dt, model) {
        //
        // CALCULATE values for the translation
        //
        let dx = this.#speed * ((model.leader.x + 9 * model.leader.sx) - this.x);
        let dy = -Math.abs(this.x - model.leader.x) + 1;

        //
        // APPLY the calculations
        //
        this.x += dx * dt;
    }

    getGraph(model) {
        let graph = {};

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
        let elipseCenter = {x:1.9, y: 0};

        let scalingExtra = 7;
        graph = {
            
            // Chest
            transform: {
                dx: model.follower.x, 
                dy: model.follower.y + 0.2, 
                sx: model.follower.sx * scalingExtra,
                sy: model.follower.sy * 2 * scalingExtra, 
                a: 0 * Math.PI,
            },    
            style: {
                fill: "orange",
                stroke: "orange",
                lineWidth: 0.3,
            },    
            
            shape: simpleElipse,
            children: [

                this.parachute.getGraph(),

                // RIGHT Arm
                {
                    transform: {
                        dx: 1, 
                        dy: -0.05, 
                        sx: 2, 
                        sy: 0.1,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "orange",
                        stroke: "orange",
                        lineWidth: 0.3,
                    },    

                    shape: simpleElipse,
                    children: [

                    ]
                },
                
                // RIGHT Leg
                {
                    transform: {
                        dx: 0.4, 
                        dy: 0.7, 
                        sx: 0.4, 
                        sy: 0.8,
                        a: -0.5 * Math.PI,
                    },    
                    style: {
                        fill: "orange",
                        stroke: "orange",
                        lineWidth: 0.3,
                    },    

                    shape: PointsUtils.rotatePoints(simpleElipse, 0 * Math.PI, elipseCenter),
                },


                // LEFT Leg
                {
                    transform: {
                        dx: -0.4, 
                        dy: 0.7, 
                        sx: 0.4, 
                        sy: 0.8,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "orange",
                        stroke: "orange",
                        lineWidth: 0.3,
                    },    

                    shape: PointsUtils.rotatePoints(simpleElipse, 0 * Math.PI, elipseCenter),
                },

                // LEFT Arm
                {
                    transform: {
                        dx: -0.7, 
                        dy: -0.05, 
                        sx: 2, 
                        sy: 0.1,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "orange",
                        stroke: "orange",
                        lineWidth: 0.3,
                    },    

                    shape: simpleElipse,
                },


                // 
                {
                    transform: {
                        dx: 0, 
                        dy: 0.4, 
                        sx: 1.1, 
                        sy: 0.05,
                        a: 0 * Math.PI,
                    },    
                    style: {
                        fill: "brown",
                        stroke: "brown",
                        lineWidth: 0.1,
                    },    

                    shape: PointsUtils.rotatePoints(simpleElipse, 0 * Math.PI, elipseCenter),
                },

                // Face
                {
                    transform: {
                        dx: 0, 
                        dy: -0.5, 
                        sx: 1.5, 
                        sy: 0.5,
                        a: 0.5 * Math.PI,
                    },
                    style: {
                        fill: this.#pigmentation,
                        stroke: this.#skinBorderColor,
                        lineWidth: 0.03,
                    },

                    shape: simpleElipse,
                    children: [

                        //
                        // Helmet (LEFT half)
                        //
                        {
                            transform: {
                                dx: -1.4, 
                                dy: 0.65, 
                                sx: 0.8 * 0.38, 
                                sy: 0.6 * 0.38,
                                a: -0.5 * Math.PI,
                            },    
                            style: {
                                fill: "black",
                                stroke: "grey",
                                lineWidth: 0.03,
                            },    
        
                            shape: this.#getHelmetHalfPath(),
                            children: [

                                //
                                // Helmet (RIGHT half)
                                //
                                {
                                    transform: {
                                        dx: 5.83, 
                                        dy: 0, 
                                        sx: -1, 
                                        sy: 1,
                                        a: 0 * Math.PI,
                                    },    
                                    style: {
                                        fill: "black",
                                        // stroke: "grey",
                                        lineWidth: 0.03,
                                    },    
                
                                    shape: this.#getHelmetHalfPath(),
                                    children: []
        
                                },

                                ...this.#getEyesGraph(),
                            ]
                        },

                        //
                        // Mouth
                        //
                        {
                            transform: {
                                dx: 0.5, 
                                dy: 0, 
                                sx: 0.2, 
                                sy: 0.2,
                                a: 0.5 * Math.PI,
                            },    
                            style: {
                                fill: this.#mouthColor,
                                stroke: "white",
                                lineWidth: 0.092,
                            },    

                            shape: simpleElipse,
                            children: []
                        },

                        //
                        // Nose
                        //
                        {
                            transform: {
                                dx: 0.2, 
                                dy: 0, 
                                sx: 0.2, 
                                sy: 0.2,
                                a: -0.5 * Math.PI,
                            },    
                            style: {
                                // fill: "grey",
                                stroke: this.#skinBorderColor,
                                lineWidth: 0.1,
                            },    

                            shape: [{x: 0, y: 0}, {x: -0.5, y: -0.5}, {x: 0, y: -1}],
                            children: []
                        },
                    ]
                },
            ]
        };

        return graph;
    }

    #getEyesGraph() {
        let eyesArr = [];

        let eyesBasicStats = {pos_y: 3.9, sx: 0.1 * this.eyeSize, sy: 0.2 * this.eyeSize, a: -1.5, color: "brown"};
        eyesArr.push(Leader.getEyeGraph({...eyesBasicStats, pos_x: 1.5 + 0 * this.eyesOffset}));
        eyesArr.push(Leader.getEyeGraph({...eyesBasicStats, pos_x: 1.5 + 1 * this.eyesOffset}));

        return eyesArr;
    }

    #getHelmetHalfPath() {
        let helmetPath = [];

        //
        // Inner part
        //
        helmetPath.push(
            {x: 0.27, y: 5.08},
            {x: 0.38, y: 4.75},
        );
        
        helmetPath = helmetPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 0.38, y: 4.75 }, // startPoint
            { x: 0.49, y: 4.55 }, // controlPoint
            { x: 0.70, y: 4.47 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        helmetPath.push({ x: 0.85, y: 3.61 });

        helmetPath = helmetPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 0.85, y: 3.61 }, // startPoint
            { x: 0.92, y: 3.21 }, // controlPoint
            { x: 1.32, y: 3.14 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        //
        // Central part
        //
        helmetPath.push(
            {x: 3.00, y: 2.98},
            {x: 2.95, y: 0.82},
        );

        //
        // Outter part
        //
        helmetPath = helmetPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 2.95, y: 0.82 }, // startPoint
            { x: 0.09, y: 0.98 }, // controlPoint
            { x: 0.07, y: 3.85 }, // endPoint
            this.#NUM_POINTS_CURVES
        ));

        helmetPath = helmetPath.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 0.07, y: 3.85 }, // startPoint
            { x: 0.06, y: 4.47 }, // controlPoint
            helmetPath.shift(),
            this.#NUM_POINTS_CURVES
        ));

        return helmetPath;
    }
}