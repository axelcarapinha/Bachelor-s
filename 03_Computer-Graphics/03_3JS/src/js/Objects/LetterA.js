import { PointsUtils } from "../utils/Points.js";
import { Letter } from "./Letter.js";

export class LetterA extends Letter {
    constructor({size = 2.5, pos_x = 0, pos_y = 0, pos_z = 10.5, color = "skyblue"}) {
        //
        let g = LetterA.getGeometry();
        
    //
    // Using shaders to make the gradient (almost imperceptible)
    //
    /*
        uv = coordinates from 0 to 1 (uv coordinates)
        vUv = uv (coordinates of the current vertex)
        Create a function that determines the color of the point for each part
    */

    // Uniform = way to pass data from the CPU (JS) to the GPU (shader)
    let uniforms = {
        color: { value: new THREE.Color(color) }, 
    };

    let vertexShader = `
        varying vec2 vUv; // a variable
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`
    ;
    // vec2 = coordinates from the vertexShader
    let fragmentShader = `
        varying vec2 vUv;
        uniform vec3 color;
        void main() {
            // Using the color received as destructured parameter in the constructor
            float gradientFactor = vUv.y; // vUv.y makes the graient vertical
            vec3 gradientColor = mix(vec3(255.0 / 255.0, 310.0 / 255.0, 64.0 / 255.0), vec3(255.0 / 255.0, 300.0 / 255.0, 64.0 / 255.0), gradientFactor); // vec3 = colors in RGB
            gl_FragColor = vec4(gradientColor * color, 1.0);
        }`
    ;
    //
    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

        super({
            g: g,
            m: shaderMaterial,
            size: size,
            pos_x: pos_x,
            pos_y: pos_y,
            pos_z: pos_z - 1.5,
        });
    }

    static getGeometry() {
        return this.getBasicExtr({
            mainPath: LetterA.getMainPath(), 
            holePath: LetterA.#getHolePath(),
            deepness: 0.5,
        });
    }

    static getMainPath() {
        let path = [];

        path.push(
            {x: 2.84, y: 3.30},
            {x: 3.22, y: 3.30},
            {x: 3.58, y: 1.85},
            {x: 3.76, y: 1.63},
        );

        let startPoint    = { x: 3.76, y: 1.63 };
        let controlPoint =  { x: 3.18, y: 1.45 };
        let endPoint      = { x: 2.68, y: 1.57 }; 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        startPoint    = endPoint;
        controlPoint =  { x: 1.78, y: 2.03 };
        endPoint      = { x: 1.66, y: 2.93 }; 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        startPoint    = endPoint;
        controlPoint =  { x: 1.56, y: 3.35 };
        endPoint      = { x: 1.62, y: 3.76 }; 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        startPoint    = endPoint;
        controlPoint =  { x: 1.82, y: 3.98 };
        endPoint      = { x: 2.11, y: 3.80 }; 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        path.push(path.shift());

        return path;
    }

    static #getHolePath() {
        let path = [];

        path.push(
            {x: 3.23, y: 1.82},
            {x: 2.94, y: 3.03},
        );

        let startPoint    = { x: 2.94, y: 3.03 };
        let controlPoint  = { x: 2.19, y: 3.57 };
        let endPoint      = { x: 2.02, y: 3.05 }; 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        startPoint    = endPoint;
        controlPoint =  { x: 2.13, y: 2.27 };
        endPoint      = { x: 2.61, y: 1.85 }; 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        startPoint    = endPoint;
        controlPoint =  { x: 2.98, y: 1.72 };
        endPoint      = path.shift(); 
        path = path.concat(PointsUtils.BezierCurve2D(startPoint, controlPoint, endPoint, Letter.NUM_POINTS_CURVES));

        // path.push(path.shift());

        return path;
    }
}



