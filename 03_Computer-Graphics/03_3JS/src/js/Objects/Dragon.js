import { PointsUtils } from "../utils/Points.js";
import { Ctx } from "../Rendering/GraphicalCtx.js";
//
import { AnimationTimes } from "../Tools/AnimationTimes.js";

export class Dragon extends THREE.Mesh {
    constructor({depth = 5, color = "yellow", pos_x = 0, pos_y = 0, pos_z = 0}) {
        let geom = Dragon.getGeometry();
        //
        let mat  = new THREE.MeshBasicMaterial({ color: color, wireframe: true }); 
        mat.side = THREE.DoubleSide;
        //
        super(geom, mat);

        this.depth = depth;
        this.vel_x = 30;

        this.position.x = pos_x;
        this.position.y = pos_y;
        this.position.z = pos_z - 5;

        //
        // Definition of the TWEENs
        //
        this.goUpSentence = new TWEEN.Tween(this.position)
            .to({ x: -5, y: 90, z: 110 }, 1000 * 2)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(AnimationTimes.totalEntrance); // wait for the sentence to be placed
        ;
        //
        this.goStage = new TWEEN.Tween(this.position)
            .to({ x: -5, y: -10, z: 10  }, 1000 * 2)
            .easing(TWEEN.Easing.Quadratic.InOut)
        ;
        this.flip = new TWEEN.Tween(this.rotation)
            .to({ x: 4 * Math.PI}, 1000 * 0.5)
            .easing(TWEEN.Easing.Quadratic.Out)
        ;

        this.goUpSentence.onComplete( () => this.flip.start());
        this.goUpSentence.chain(this.goStage);

        this.goUpSentence.start();
    }

    static getGeometry() {
        let shape_fig = {
            shape: PointsUtils.DragonLsystPath(6),
        }
    
        let shape = Ctx.draw_figure(shape_fig);
    
        let spine_points = [
            new THREE.Vector3(0, -20, 0),
            new THREE.Vector3(0, 20, 0)
        ];
        //
        let spine = new THREE.CatmullRomCurve3(spine_points);
        //
        let parameters = {        
            extrudePath: spine,
    
        };
        
        const geometry = new THREE.ExtrudeGeometry( shape, parameters );
    
        return geometry;
    }
}