import { GraphicalCtx } from "../Rendering/GraphicalCtx.js";
import { PointsUtils } from "../utils/Points.js";
import { Animation } from "../Rendering/Animation.js";

export class Rocket {
    orbitingSize = 0.04;
    orbitingCenter = {}

    constructor({id = "rocket", earthRadius = 0.5, earthCenter = {x: 0, y: 0, z: 0}, size = 0.1, planetRotP = 24}) {
        // Static to access in the animation setup, instead of declaring local variables there to hold this values
        Rocket.orbitingSize = size;
        Rocket.orbitingRadius = earthRadius;
        Rocket.orbitingPoint  =  earthCenter;
        //
        Rocket.takeOffHeight = -3;
        Rocket.initialHeightStep = 0.001 * 1;
        Rocket.lastHeightStep    = 0.001 * 2;

        this.id = id;
        //
        this.numTailFins = 4;
        this.center2Dpoint = {x: 1.90, y: 2.37};
        this.orbitalRadius = earthRadius + 0.1;
        this.orbitalCenter  = earthCenter; 
        this.rotPeriod = planetRotP / 2.3;
        //
        this.bodyRadius = 1;
        this.size = size;
        //
        this.bottomPoint = {x: 2.34, y: 1.82};
        this.upperPoint  = {x: 1.48, y: 3.08}; 
        //
        this.speed = 20;
        
        this.numFlames = 60;
        this.numFlameCircles = 3;

        //
        // Starting positions
        //
        this.bodyStartPos = {x: 20.0, y: 7.0, z: 2.0};
        this.bodyEndPos   = {x: 2.5, y: 0.0, z: 2.0};
        //
        this.windowFrameStartPos = {x: 10, y: -10, z: 8.0};
        this.windowFrameEndPos   = {x: 4.0, y: 0.0, z: 3.0};
        //
        this.coneStartPos = {x: 50, y: 5.0, z: -7.0};
        this.coneEndPos   = {x: 6.0, y: 0.0, z: 2.0};
    }

    getGraph({rot = 1 * Math.PI}) {
        return {
            tag: 'transform',
            attributes: {
                DEF: this.id,
                translation:  
                    `${this.orbitalCenter.x + this.orbitalRadius}, 
                     ${this.orbitalCenter.y + this.orbitalRadius}, 
                     ${this.orbitalCenter.z + this.orbitalRadius}`, 
                scale: `${this.size}, ${this.size}, ${this.size}`,
                rotation: `0 0 1 ${rot}`,
            },
            children: [
           
                ...this.#getTailFins(),
                this.#getBodyTube(),
                this.#getWindow(),
                this.#getNoseCone(),
                
                // Object that allows to control all the stars at the same time
                {
                    tag: 'transform',
                    attributes: {
                        DEF: `${this.id}FlamesController`,
                        translation: "1000 0 0",
                        scale: "1 1 1"
                    },
                    children: this.#getFlames(), // getFlames returns an array with flame objects
                },
            ]
        };
    }

    #getNoseCone() {
        return {
            tag: 'transform',
            attributes: {
                DEF: `${this.id}NoseCone`,
                translation: "6 0 2",
                scale: "1 1 1",
                rotation: `0 0 1 ${-0.5 * Math.PI}`,

            },
            children: [
                {
                    tag: 'shape',
                    children: [
                        {
                            tag: 'appearance',
                            children: [
                                {
                                    tag: 'PixelTexture',
                                    attributes: {
                                        image: '1 2 3 0xFFB500 0xFFFF00',
                                        repeatS: 'FALSE',
                                        repeatT: 'FALSE',
                                    }

                                },
                            ],
                        },

                        {
                            tag: 'cone',
                            attributes: {
                                height: "2.0",  
                                bottomRadius: `${this.bodyRadius}`,  
                            },
                        },
                    ]
                }
            ]
        };
    }

    #getFlames() {
        let flamesGraphs = [];
    
        let flamesPerCircle = this.numFlames / this.numFlameCircles;
        //
        const RADIUS_ONE = this.bodyRadius - 0.1;
        const RADIUS_TWO = this.bodyRadius - 0.5;
        const RADIUS_THREE = this.bodyRadius - 0.8;
    
        for (let circle = 0; circle < this.numFlameCircles; circle++) {
            for (let i = 0; i < flamesPerCircle; i++) {
                let angle = (i / flamesPerCircle) * (2 * Math.PI);
                let distance = (circle === 0) ? RADIUS_ONE : ((circle === 1) ? RADIUS_TWO : RADIUS_THREE);
                let pos_x = Math.cos(angle) * distance;
                let pos_z = Math.sin(angle) * distance;
    
                let flamePart = {
                    tag: 'transform',
                    attributes: {
                        DEF: `flame${circle}${i}`,
                        translation: `2 ${pos_x} ${pos_z + 2}`,
                        scale: "1 0.5 1",
                        rotation: `0 0 1 ${0.5 * Math.PI}`,
                    },
                    children: [
                        // Geometry
                        {
                            tag: 'shape',
                            children: [
                                {
                                    tag: 'appearance',
                                    children: [
                                        {
                                            tag: 'twosidedmaterial',
                                            attributes: {
                                                diffuseColor: "crimson",
                                                specularColor: "1 1 1",
                                                shininess: "50",
                                                emissiveColor: '0,0,0',
                                            }
                                        },
                                    ],
                                },
                                {
                                    tag: 'cone',
                                    attributes: {
                                        height: "4",
                                        bottomRadius: "0.1",
                                    },
                                },
                            ]
                        },
                    ]
                };
                flamesGraphs.push(flamePart);
            }
        }
    
        return flamesGraphs;
    }

    #getBodyTube() {
        //
        // Body Tube (rocket body)
        //
        return {
            tag: 'transform',
            attributes: {
                DEF: `${this.id}BodyTube`,
                translation: `${this.bodyStartPos.x} ${this.bodyStartPos.y} ${this.bodyStartPos.z}`,
                scale: "1 1 1",
            },
            children: [
                {
                    tag: 'shape',
                    children: [
                        {
                            tag: 'appearance',
                            children: [
                                {
                                    tag: 'twosidedmaterial',
                                    attributes: {
                                        diffuseColor: `${255 / 255},${240 / 255},${240 / 255} `,
                                    }
                                },
                            ],
                        },

                        {
            
                            tag: 'extrusion',
                            attributes: {
                                id: "name",
                                convex: "false",
                                crossSection: GraphicalCtx.build_path2D(PointsUtils.circle_path()),
                                spine: GraphicalCtx.build_path3D(GraphicalCtx.makeGradualSpine(0,2.5,50)),
                            },
                        
                        },
                    ]
                },
            ]
        };
    }

    #getWindow() {
        let windowSize = 0.6;

        return {
            tag: 'transform',
            attributes: {
                DEF: `${this.id}WindowFrame`,
                translation: "4 0 3",
                scale: `${windowSize} ${windowSize} ${windowSize}`,
                rotation: `0 1 0 ${0.5 * Math.PI}`,

            },
            children: [

                //
                // Window's METAL FRAME
                //
                {
                    tag: 'shape',
                    children: [

                        {
                            tag: 'appearance',
                            children: [
                                {
                                    tag: 'twosidedmaterial',
                                    attributes: {
                                        diffuseColor: `${119 / 255},${130 / 255},${136 / 255}`, 
                                    }
                                },
                            ],
                        },

                        {
            
                            tag: 'extrusion',
                            attributes: {
                                id: "name",
                                convex: "false",
                                crossSection: GraphicalCtx.build_path2D(PointsUtils.circle_path()),
                                spine: GraphicalCtx.build_path3D(GraphicalCtx.makeGradualSpine(0,2.5,50)),
                            },
                        },
                    ]
                },

                //
                // Window's glass
                //
                this.#getWindowGlass(),
            ]
        };
    }

    #getWindowGlass() {
        let windowSize = 0.7;

        return {
            tag: 'transform',
            attributes: {
                DEF: `${this.id}windowGlass`,
                translation: "-0.1 0 0",
                scale: `${windowSize} ${windowSize} ${windowSize}`,
                rotation: `0 1 0 ${0 * Math.PI}`,
            },
            children: [

                //
                // Window's GLASS
                //
                {
                    tag: 'shape',
                    children: [

                        {
                            tag: 'appearance',
                            children: [
                                {
                                    tag: 'twosidedmaterial',
                                    attributes: {
                                        diffuseColor: `${3 / 255},${76 / 255},${170 / 255}`,
                                        transparency: '0.5',
                                    }
                                },
                            ],
                        },

                        // {
                        //     tag: 'Ring',
                        //     attributes: {
                        //         innerRadius: "1",
                        //         outerRadius: "1.5",
                        //     },
                        // },

                        {
            
                            tag: 'extrusion',
                            attributes: {
                                id: "name",
                                convex: "false",
                                //TODO rodar os pontos
                                crossSection: GraphicalCtx.build_path2D(PointsUtils.circle_path()),
                                spine: GraphicalCtx.build_path3D(GraphicalCtx.makeGradualSpine(0,2.5,50)),
                            },
                        },
                    ]
                },
            ]
        };
    }

    #getTailFins() {
        let rocketTailFins = [];

        let finalFinPath = PointsUtils.rotatePoints(this.#get_tailFin_path(), -0.3 * Math.PI, this.center2Dpoint);
        finalFinPath = PointsUtils.reflectAcrossAxis(finalFinPath, this.bottomPoint, this.upperPoint);
    
        let finId = 0;
        
        let finPosRadius = this.bodyRadius * 0.0001;
        for (let angle = 0; angle < 2 * Math.PI; angle += (2 * Math.PI / this.numTailFins)) {

            let tailFin = {
                tag: 'transform',
                attributes: {
                    DEF: `${this.id}fin${finId}`,
                    translation: `0 ${Math.cos(angle) * finPosRadius + 0} ${Math.sin(angle) * finPosRadius + 0}`,
                    scale: "1 1 1",
                    rotation: `1 0 0 ${angle}`,
                },
                children: [
                    {
                        tag: 'shape',
                        children: [

                            // Appearance
                            {
                                tag: 'appearance',
                                children: [
                                    {
                                        tag: 'twosidedmaterial',
                                        attributes: {
                                            diffuseColor: "orange",
                                        }
                                    },
                                ],
                            },

                            // Geometry
                            {
                                tag: 'extrusion',
                                attributes: {
                                    id: "rocketFins",
                                    convex: "false",
                                    crossSection: GraphicalCtx.build_path2D(finalFinPath),
                                    spine: GraphicalCtx.makeSpineLength(0.1),
                                },
                            
                            },
                        ]

                    }
                ]
            };

            rocketTailFins.push(tailFin);
            finId++; // generate different DEFs
        }
        // Final adjustment to the position of the fins
        rocketTailFins[0].attributes.translation = "0.7 0 1";
        rocketTailFins[1].attributes.translation = "0.7 1 2";
        rocketTailFins[2].attributes.translation = "0.7 0 3";
        rocketTailFins[3].attributes.translation = "0.7 -1 2";

        return rocketTailFins;
    }

    #get_tailFin_path() {
        let tailFin_path = [];
    
        // Inner curve
        tailFin_path = tailFin_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 2.06, y: 2.89 }, // startPoint
            { x: 2.17, y: 2.58 }, // controlPoint
            { x: 2.63, y: 2.10 }, // endPoint
            GraphicalCtx.NUM_POINTS_CURVES
        ));
    
    
        // Upper curve
        tailFin_path = tailFin_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 2.63, y: 2.10 }, 
            { x: 2.19, y: 2.05 }, 
            { x: 1.79, y: 2.07 }, 
            GraphicalCtx.NUM_POINTS_CURVES
        ));
    
        // Upper corner
        tailFin_path = tailFin_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.79, y: 2.07 }, 
            { x: 1.71, y: 2.06 }, 
            { x: 1.65, y: 2.12 }, 
            GraphicalCtx.NUM_POINTS_CURVES
        ));
    
        // Exterior part
        tailFin_path = tailFin_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.65, y: 2.12 }, 
            { x: 1.52, y: 2.22 }, 
            { x: 1.14, y: 2.91 }, 
            GraphicalCtx.NUM_POINTS_CURVES
        ));
    
        // Bottom corner
        tailFin_path = tailFin_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.14, y: 2.91 }, 
            { x: 1.13, y: 2.95 }, 
            { x: 1.18, y: 2.94 }, 
            GraphicalCtx.NUM_POINTS_CURVES
        ));
    
        // Bottom curve
        tailFin_path = tailFin_path.concat(PointsUtils.quadraticBezierCurve_path(
            { x: 1.18, y: 2.94 },
            { x: 1.66, y: 2.61 }, 
            tailFin_path.shift(), 
            GraphicalCtx.NUM_POINTS_CURVES
        ));
    
        tailFin_path.push(tailFin_path.shift());
    
        return tailFin_path;
    }

    // Customised default values differ from the Planet class ones
    getAnimationArr({hasAxialRotAnim = true, hasOrbitAnim = false, orbitCenter = null, orbitRadius_x = 1, orbitRadius_y = 1, rotValues = "0 1 0", startTime = `${0}`, isEnabled = "true", hasAssemble = false}) { 
        let animationArr = [];
        let auxiliaryArr  = [];

        //
        // Axial Rotation
        //
        if (hasAxialRotAnim) {
            auxiliaryArr = Animation.getAxialRotArr({id: this.id, rotPeriod: this.speed, rotValues: rotValues, rotDelay: 0.5 * Math.PI, isEnabled: isEnabled});
            animationArr = [...animationArr, ...auxiliaryArr];
        }
        
        //
        // Orbit
        //      
        if (hasOrbitAnim) {
            auxiliaryArr = Animation.getOrbitArr({id: this.id, orbitCenter: orbitCenter, orbitPeriod: this.speed, orbitRadius_x: orbitRadius_x, orbitRadius_y: orbitRadius_y, isEnabled: isEnabled});
            animationArr = [...animationArr, ...auxiliaryArr];
        }

        //
        // Translation (to assemble the parts)
        //
        if (hasAssemble) {
            let delayTime = 0;

            // Body
            auxiliaryArr = Animation.getCoordInterpolationArr({id: `${this.id}BodyTube`, startPoint: this.bodyStartPos, endPoint: this.bodyEndPos, interpTime: Animation.assembleRocketBody + delayTime, isEnabled: "false"});

            // Cone
            auxiliaryArr = auxiliaryArr.concat(Animation.getCoordInterpolationArr({id: `${this.id}NoseCone`, startPoint: this.coneStartPos, endPoint: this.coneEndPos, interpTime: Animation.assembleRocketWindow + delayTime, isEnabled: "false"}));

            // WindowFrame
            auxiliaryArr = auxiliaryArr.concat(Animation.getCoordInterpolationArr({id: `${this.id}WindowFrame`, startPoint: this.windowFrameStartPos, endPoint: this.windowFrameEndPos, interpTime: Animation.assembleRocketCone + delayTime, isEnabled: "false"}));

            // Join all the animation graphs
            animationArr = [...animationArr, ...auxiliaryArr];
        }

        return animationArr;
    }
}
