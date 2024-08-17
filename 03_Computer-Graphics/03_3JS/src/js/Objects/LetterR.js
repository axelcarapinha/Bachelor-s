import { PointsUtils } from "../utils/Points.js";
import { Letter } from "./Letter.js";

export class LetterR extends Letter {
    constructor({size = 1, pos_x = 2.5, pos_y = 0, pos_z = 7, color = "skyblue"}) {
        //
        let g = LetterR.getGeometry();
        //
        let m = new THREE.MeshBasicMaterial({color: color});
        m.side = THREE.DoubleSide;
        //
        super({
            g: g,
            m: m,
            size: size + 0.2,
            pos_x: pos_x,
            pos_y: pos_y,
            pos_z: pos_z - 0.7,
        });
    }

    static getGeometry() {
        return this.getBasicExtr({
            mainPath: LetterR.#getMainPath(), 
            // holePath: ,
            deepness: 0.5,
        });
    }

    static #getMainPath() {
        let path = [];
    
        path = Letter.getRightSwashPath();
        //
        const x_deslocamento = Math.abs(path.pop().x  - 4.72);
        const y_deslocamento = Math.abs(path.pop().y  - 0.77);
        path = PointsUtils.translatePoints(path, x_deslocamento, y_deslocamento);
        
        path.push({ x: 4.72, y: 0.77 });
    
        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 4.72, y: 0.77 }, // startPoint
            { x: 4.76, y: 0.90 }, // controlPoint
            { x: 4.82, y: 0.78 }, // endPoint
            Letter.NUM_POINTS_CURVES
        ));
    
        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 4.82, y: 0.78 }, 
            { x: 5.75, y: 0.15 }, 
            { x: 5.99, y: 0.36 },
            Letter.NUM_POINTS_CURVES
        ));
    
        path.push({ x: 5.80, y: 1.02 });
    
        path = path.concat(PointsUtils.BezierCurve2D(
            { x: 5.80, y: 1.02 }, 
            { x: 5.27, y: 0.67 },
            { x: 4.75, y: 1.09 }, 
            Letter.NUM_POINTS_CURVES
        ));

        return path;
    }
}



