import { PointsUtils } from "../utils/Points.js";
import { CalcsUtils } from "../utils/Calcs.js";
//
import { Letter } from "./Letter.js";

export class LetterO extends Letter {
    static center = {x: 1.67, y: 1.82};

    constructor({size = 1, pos_x = 6, pos_y = 0, pos_z = 4, color = "skyblue"}) {
        let g = LetterO.getGeometry();
        //
        // let translationMatrix = new THREE.Matrix4().makeTranslation(0, 0, -2);
        let straightenUpRotMatrix = new THREE.Matrix4()
            .makeRotationAxis(new THREE.Vector3(0, 1, 0) // rotate around the yy axis (consider its points are in y = 0)
            .normalize(), -0.5 * Math.PI
        );
        let simmetricRotMatrix = new THREE.Matrix4()
            .makeRotationAxis(new THREE.Vector3(0, 1, 0) // rotate around the zz axis (consider its points are in y = 0)
            .normalize(), 0.2 * Math.PI
        );
        // g.applyMatrix4(translationMatrix);
        g.applyMatrix4(straightenUpRotMatrix);
        g.applyMatrix4(simmetricRotMatrix);
        //
        let m = new THREE.MeshBasicMaterial({color: color});
        m.side = THREE.DoubleSide;
        
        super({
            g: g,
            m: m,
            size: size - 0.1,
            pos_x: pos_x + 2,
            pos_y: pos_y,
            pos_z: pos_z + 1.5,
            rot_y: 0.5 * Math.PI,
        });
        this.position.z -= 3;
    }

    static getGeometry() {
        return this.getBasicExtr({
            mainPath: LetterO.#getMainPath(), 
            holePath: LetterO.#getHolePath(),
            deepness: 0.5,
        });
    }

    static #getMainPath() {
        return PointsUtils.elipse_path(
            CalcsUtils.dist({x: 0.92, y: 3.63 }, {x: 2.39, y: 0.26 }), // semi-major Axis OUTER
            CalcsUtils.dist({x: 2.55, y: 2.78 }, {x: 0.79, y: 1.12 }), // semi-major Axis INNER
            Letter.NUM_POINTS_CURVES * 4, // for greater detail
        );
    }

    static #getHolePath() {
        let path = [];
    
        path = path.concat(PointsUtils.elipse_path(
            CalcsUtils.dist({x: 1.36, y: 3.28 }, {x: 1.97, y: 0.62 }), // semi-major Axis OUTER
            CalcsUtils.dist({x: 0.88, y: 1.82 }, {x: 2.42, y: 2.06 }), // semi-major Axis INNER
            Letter.NUM_POINTS_CURVES * 4,
        ));
        // path = LetterO.#getMainPath();
        //
        path = PointsUtils.rotatePoints(path, CalcsUtils.degreesToRadians(-18), LetterO.center);
        path = PointsUtils.translatePoints(path, 0.5, -0.4, 0);

        return path;
    }   
}
