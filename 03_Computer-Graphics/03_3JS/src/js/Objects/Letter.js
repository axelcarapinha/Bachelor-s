
import { PointsUtils } from "../utils/Points.js";
import { Ctx } from "../Rendering/GraphicalCtx.js";
//
import { AnimationTimes } from "../Tools/AnimationTimes.js";

export class Letter extends THREE.Mesh {
    //
    // Default rendering settings
    //
    static NUM_POINTS_CURVES = Ctx.NUM_POINTS_CURVES;
    //
    static SCALE = 2;
    //
    static ROT_X =  0.0 * Math.PI;
    static ROT_Y = -0.5 * Math.PI;
    static ROT_Z =  0;

    constructor({g = null, m = null, size = Letter.SCALE, pos_x = 0, pos_y = 0, pos_z = 0, rot_x = Letter.ROT_X, rot_y = Letter.ROT_Y, rot_z = Letter.ROT_Z}) { // calling size to not confuse with this.scale of the object
        super(g, m);
        //
        this.position.set(pos_x, pos_y, pos_z);
        this.scale.set(size, size, size);
        this.rotation.set(rot_x,rot_y,rot_z);

        //
        // Definition of the TWEENs
        //

        // Rotations
        this.doFlipY = new TWEEN.Tween(this.rotation) // the observed delay was pretended, caused by the different creation times
            .to({ y: this.rotation.y + 2 * Math.PI }, 1000 * 1)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(AnimationTimes.totalEntrance)
        ;

        // Scalings
        this.getBiggerScaleY = new TWEEN.Tween(this.scale) // animated along the extrusion's spine
            .to({ y: this.scale.y + 5.0 }, 1000 * 2)
            .easing(TWEEN.Easing.Elastic.Out) 
        ;
        this.getNormalScaleY = new TWEEN.Tween(this.scale)
            .to({ y: this.scale.y }, 1000 * 2)
            .easing(TWEEN.Easing.Elastic.Out)
        ;
        
        this.doFlipY.chain(this.getBiggerScaleY);
        this.getBiggerScaleY.chain(this.getNormalScaleY);
        this.getNormalScaleY.chain(this.doFlipY);

        this.doFlipY.start();    
    }

    //
    // Building tools
    //
    static getBasicExtr({mainPath, holePath = null, deepness = Ctx.DEEPNESS}) {
        // 
        // Shape
        //
        let shape = Ctx.draw_figure({ shape: mainPath });

        //
        // Hole
        //
        if (holePath != null) {
            let hole  = Ctx.draw_figure({ shape: holePath });
            shape.holes.push(hole);
        }
    
        //
        // Extrusion
        //
        let spine_points = [
            new THREE.Vector3(0, -deepness, 0),
            new THREE.Vector3(0, deepness, 0)
        ];
        //
        let spine = new THREE.CatmullRomCurve3(spine_points);
        //
        let parameters = {        
            extrudePath: spine, 
    
        };
        
        //
        // Geometry
        //
        const geometry = new THREE.ExtrudeGeometry( shape, parameters );
    
        return geometry;
    }
    
    // Paths
    static getInferiorSwashPath() {
        let shape_path = [];

        shape_path.push(
            { x: 4.04, y: 1.45 },
            { x: 3.28, y: 4.94 },
        );

        let startPoint   = { x: 3.28, y: 4.94 };
        let controlPoint = { x: 3.32, y: 5.80 };
        let endPoint     = { x: 3.97, y: 5.46 };
        shape_path = shape_path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        shape_path.push(
            { x: 5.76, y: 4.26 },
            { x: 5.62, y: 4.07 },
            { x: 4.63, y: 4.67 },
        );

        startPoint   = { x: 4.63, y: 4.67 };
        controlPoint = { x: 4.10, y: 4.77 };
        endPoint     = { x: 4.11, y: 4.23 };
        shape_path = shape_path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        shape_path.push(
            { x: 4.88, y: 1.45 },
        );

        shape_path.reverse();

        return shape_path;
    }


    static getRightSwashPath() {
        let shape_path = [];

        shape_path.push(
            { x: 2.05, y: 2.45 },
            { x: 1.38, y: 5.28 },
            { x: 0.47, y: 5.68 },
            { x: 1.37, y: 2.39 },
            { x: 1.47, y: 1.76 },
        );

        let startPoint   = { x: 1.47, y: 1.76 };
        let controlPoint = { x: 1.51, y: 1.36 };
        let endPoint     = { x: 1.04, y: 1.44 };
        shape_path = shape_path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        shape_path.push(
            { x: 0.37, y: 1.77 },
            { x: 0.35, y: 1.52 },
            { x: 2.14, y: 0.51 },
        );

        startPoint   = { x: 2.14, y: 0.51 };
        controlPoint = { x: 2.50, y: 0.44 };
        endPoint     = { x: 2.52, y: 0.76 };
        shape_path = shape_path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));


        shape_path.push({x: 2.43, y: 1.03});

        return shape_path;
    }
}
