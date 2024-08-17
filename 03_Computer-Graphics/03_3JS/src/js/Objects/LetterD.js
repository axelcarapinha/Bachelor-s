import { PointsUtils } from "../utils/Points.js";
import { Letter } from "./Letter.js";
//
import { LetterA } from "./LetterA.js";

export class LetterD extends Letter {
    constructor({size = 2, pos_x = 0, pos_y = 0, pos_z = 9, color = "skyblue"}) {
        let d_g = LetterD.getGeometry();
        //
        let a_g = LetterA.getGeometry();
        // let scaleMatrix = new THREE.Matrix4().makeScale(1.05, 0.95, 1); 
        // a_g.applyMatrix4(scaleMatrix);
        //
        let mergedGeometry = new THREE.Geometry();
        mergedGeometry.merge(d_g);
        mergedGeometry.merge(a_g, new THREE.Matrix4().makeTranslation(0, -0.2, -0.3)); 
        
        let m = new THREE.MeshBasicMaterial({color: color});
        m.side = THREE.DoubleSide;
        //
        super({
            g: mergedGeometry,
            m: m,
            size: size + 0.4,
            pos_x: pos_x,
            pos_y: pos_y,
            pos_z: pos_z,
        });
    }

    static getGeometry() {
        return this.getBasicExtr({
            mainPath: LetterD.#getUpperPath(), 
            // holePath: LetterA.getMainPath(), 
            deepness: 0.5,
        });
    }

    static #getUpperPath() {
        let path = [];

        path.push(
            {x: 3.19, y: 3.27},
            {x: 3.11, y: 3.78},
            {x: 3.70, y: 3.85},
            {x: 4.17, y: 1.73},
        );

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 4.17, y: 1.73 }, // startPoint
            { x: 4.37, y: 1.15 }, // controlPoint
            { x: 4.78, y: 0.82 }, // endPoint
            Letter.NUM_POINTS_CURVES
        ));

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 4.78, y: 0.82 }, 
            { x: 5.19, y: 0.73 }, 
            { x: 5.53, y: 0.92 }, 
            Letter.NUM_POINTS_CURVES
        ));

        path.push({x: 5.99, y: 0.36});

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 5.99, y: 0.36 }, 
            { x: 5.52, y: 0.24 }, 
            { x: 5.14, y: 0.36 }, 
            Letter.NUM_POINTS_CURVES
        ));

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 5.14, y: 0.36 }, 
            { x: 4.25, y: 0.88 }, 
            { x: 3.64, y: 1.79 }, 
            Letter.NUM_POINTS_CURVES
        ));

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 3.64, y: 1.79 }, 
            { x: 3.315, y: 2.46 }, 
            path.shift(), 
            Letter.NUM_POINTS_CURVES
        ));

        path.push(path.shift());

        return path;   
    }  
}



