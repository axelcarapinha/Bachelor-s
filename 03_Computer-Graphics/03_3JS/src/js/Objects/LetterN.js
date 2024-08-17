import { PointsUtils } from "../utils/Points.js";
import { Letter } from "./Letter.js";

export class LetterN extends Letter {
    constructor({size = 1.4, pos_x = 2, pos_y = 0, pos_z = 8, color = "orange"}) {
        //
        let g = LetterN.getGeometry();
        //
        let m = new THREE.MeshBasicMaterial({color: color});
        m.side = THREE.DoubleSide;
        //
        super({
            g: g,
            m: m,
            size: size,
            pos_x: pos_x + 1,
            pos_y: pos_y,
            pos_z: pos_z - 1,
        });
    }

    static getGeometry() {
        let leftPath = Letter.getInferiorSwashPath();
        let centralPath = LetterN.#getMainPath();
        let rightPath = Letter.getRightSwashPath();

        return this.getBasicExtr({
            mainPath: rightPath.concat(centralPath).concat(leftPath), // the order matters!
            // holePath: ,
            deepness: 0.5,
        });
    }

    static #getMainPath() {
        let path = [];
        
        path.push({x: 2.19, y: 1.66});

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 2.19, y: 1.66},  // startPoint
            { x: 2.16, y: 1.93 }, // controlPoint
            { x: 2.45, y: 1.83 }, // endPoint
            Letter.NUM_POINTS_CURVES)
        );

        path.push({x: 4.43, y: 0.60});

        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 4.43, y: 0.60}, 
            { x: 5.08, y: 0.44 }, 
            { x: 5.01, y: 1.01 }, 
            Letter.NUM_POINTS_CURVES,
        ));

        return path;
    }
}


