import { PointsUtils } from "../utils/Points.js";
import { Ctx } from "../Rendering/GraphicalCtx.js";

export class Star extends THREE.Mesh {
    constructor({pos_x = 0, pos_y = 0,pos_z = 0, color = "yellow", depth = 0.3, size = 1}) {
        let geom = Star.#getGeometry(depth);
        //
        let mat = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            reflectivity: 8,
        });

        mat.side = THREE.DoubleSide;
        //
        super(geom, mat);
        
        this.position.set(pos_x, pos_y, pos_z);
        this.rotation.set(0,0.2 * Math.PI,0);
        this.scale.set(size, size, size);
    }

    static #getGeometry(depth) {
        let shape_fig = {
            shape: PointsUtils.star_path(5,0.4),
        }
    
        let shape = Ctx.draw_figure(shape_fig);
    
        let spine_points = [
            new THREE.Vector3(0, -depth, 0),
            new THREE.Vector3(0, depth, 0)
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
