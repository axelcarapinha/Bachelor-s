import { PointsUtils } from "../utils/Points.js";

export class Animation {
    //
    // Timestamps (in seconds)
    //
    static elapsedTime = 0;
    static cumulativeElap = 0;
    
    static spotlightOn = 17.9;

    static assembleDelay = 0;
    static assembleRocketBody = 17   + Animation.assembleDelay;
    static assembleRocketWindow = 23 + Animation.assembleDelay;
    static assembleRocketCone = 32   + Animation.assembleDelay;

    static assembleTime = 6;
    static startAssemble = 29; 
    static endAssemble = Animation.startAssemble + Animation.assembleTime;
    //
    static enginesOn = 44;
    //
    static counterFrom3Starts = 46.3;
    static counterFrom3Ends = 51;
    //
    static rocketTakesOff = 55;

    static viewPointFreeMovement = 68;
    static rocketStartsOrbiting = 68.3;

    static moveAwayFromTheEarth = 132;

    static getAxialRotArr({id = null, rotPeriod = 24, rotValues = "0 1 0", rotDelay = 0, isEnabled = "true"}) {
        if (id === null)       throw new Error("ID (to target the animation) undefined." + "\n" + "Define it in the graph too! Or the animation will NOT work.");

        return [
            {
                tag: 'TimeSensor',
                attributes: {
                    DEF: `${id}AxialRotTictoc`,
                    cycleInterval: `${rotPeriod}`, 
                    loop: "true",
                    enabled: isEnabled,
                }
            },
            //
            {
                tag: 'OrientationInterpolator',
                attributes: {
                    DEF: `${id}AxialRot`,
                    key: "0.00 0.25 0.50 0.75 1.00", 
                    keyValue: [
                        `${rotValues} ${0.0000000000 + rotDelay}`,
                        `${rotValues} ${1.5707963268 + rotDelay}`,
                        `${rotValues} ${3.1415926536 + rotDelay}`, // 1 * Math.PI
                        `${rotValues} ${4.7123889804 + rotDelay}`,
                        `${rotValues} ${6.2831853072 + rotDelay}` //  2 * Math.PI
                    ].join('\n') // render_x3d() needs the newline in the string of rotations
                }
            },
            //
            {
                tag: 'Route',
                attributes: {
                    fromNode: `${id}AxialRotTictoc`,
                    fromField: "fraction_changed",
                    toNode: `${id}AxialRot`,
                    toField: "set_fraction"
                }
            },
            //
            {
                tag: 'Route',
                attributes: {
                    fromNode: `${id}AxialRot`,
                    fromField: "value_changed",
                    toNode: `${id}`, 
                    toField: "rotation"
                }
            },
        ];
    }

    static getOrbitArr({id = null, orbitCenter = null, orbitPeriod = 24, orbitRadius_x = 1, orbitRadius_y = 1, isEnabled = "true"}) {
        if (id === null)       throw new Error("ID (to target the animation) undefined.");
        if (orbitCenter === null) throw new Error("orbitCenter undefined.");

        const NUM_ORBIT_POINTS = 100;
        
        // Calculate orbit keys
        let orbitKeys = "";
        let keyStep = 1 / NUM_ORBIT_POINTS;
        for (let key = 0.0; key < 1.0; key += keyStep) {
            orbitKeys += `${key} `;
        }

        // Calculate keyValues
        let orbitPoints = PointsUtils.sector_path(NUM_ORBIT_POINTS, 0 * Math.PI, 2.0 * Math.PI, orbitRadius_x, orbitRadius_y); // radius_x and radius_y 
        
        PointsUtils.translatePoints(orbitPoints, orbitCenter.x, orbitCenter.y, orbitCenter.z);
        let keyValuesArr = orbitPoints.map(point => `${point.x} ${point.y} ${orbitCenter.z}`).join('\n');

        return [
            {
                tag: 'TimeSensor',
                attributes: {
                    DEF: `${id}OrbitTicToc`,
                    cycleInterval: `${orbitPeriod}`, 
                    loop: "true",
                    enabled: isEnabled,
                }
            },
            //
            {
                tag: 'PositionInterpolator',
                attributes: {
                    DEF: `${id}OrbitTranslation`,
                    key: orbitKeys, 
                    keyValue: keyValuesArr,   
                }
            },
            //
            {
                tag: 'Route',
                attributes: {
                    fromNode: `${id}OrbitTicToc`,
                    fromField: "fraction_changed",
                    toNode: `${id}OrbitTranslation`,
                    toField: "set_fraction"
                }
            },
            //
            {
                tag: 'Route',
                attributes: {
                    fromNode: `${id}OrbitTranslation`,
                    fromField: "value_changed",
                    toNode: `${id}`, 
                    toField: "translation"
                }
            },
        ];
    }

    static getCoordInterpolationArr({id = null, startPoint, endPoint, interpTime, isEnabled = "false"}) {
        if (id === null) throw new Error("ID (to target the animation) undefined.");
        if (startPoint === null || endPoint === null) throw new Error("StartPoint OR endpoint undefined.");
        if (interpTime === null) throw new Error("Interpolation time undefined");

        let translationKeys = "0.0 1.0";
        //
        // Calculate keyValues
        let translationPoints = [startPoint, endPoint];
        let keyValuesArr = translationPoints.map(point => `${point.x} ${point.y} ${point.z}`).join('\n');

        return [      
            {
                tag: 'TimeSensor',
                attributes: {
                    DEF: `${id}InterpolationTicToc`,
                    cycleInterval: `${interpTime}`, 
                    // loop: "false",
                    startTime: Animation.assembleTime * 2, 
                    enabled: isEnabled,
                }
            },
            //
            {
                tag: 'PositionInterpolator',
                attributes: {
                    DEF: `${id}Translation`,
                    key: translationKeys,
                    keyValue: keyValuesArr,
                }
            },
            
            {
                tag: 'Route',
                attributes: {
                    fromNode: `${id}InterpolationTicToc`,
                    fromField: "fraction_changed",
                    toNode: `${id}Translation`,
                    toField: "set_fraction"
                }
            },
            //
            {
                tag: 'Route',
                attributes: {
                    fromNode: `${id}Translation`,
                    fromField: "value_changed",
                    toNode: `${id}`, 
                    toField: "translation"
                }
            },
        ];
    }
}