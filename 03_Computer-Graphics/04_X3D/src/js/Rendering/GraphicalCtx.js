export class GraphicalCtx {
    static NUM_POINTS_CURVES = 300;
    
    constructor() {
        //
        // HTML elements
        //
        this.basket = x3d_div = document.getElementById("x3d_div");

        this.width = this.basket.clientWidth;
        this.height = this.basket.clientHeight;
        
        this.terminal = document.getElementById("terminal");

        //
        // Graphics settings
        //
        this.NUM_POINTS_CURVES = 250;
    }

    static build_path2D(points) {
        let path_spec = "";
        if (points.length > 0) {
            let start_point = points.shift();
            path_spec = `${start_point.x} ${start_point.y}`;
            for (let point of points) path_spec += ` ${point.x} ${point.y}`;
        }
    
        return path_spec;
    }
    
    
    static build_path3D(points) {
        let path_spec = "";
        if (points.length > 0) {
            let start_point = points.shift();
            path_spec = `${start_point.x} ${start_point.y} ${start_point.z}`;
            for (let point of points) path_spec += ` ${point.x} ${point.y} ${point.z}`;
        }
    
        return path_spec;
    }

    static makeSpineLength(length) { return `0.0 -${length} 0.0 0.0 ${length} 0.0`; }
    
    static makeGradualSpine(beg, end, numPoints) {
        let crossPoints = [];

        let step = (end - beg) / numPoints;
        for (let coord_x = beg; coord_x <= end; coord_x += step) {
            crossPoints.push({x: coord_x, y: 0, z: 0});
        }

        return crossPoints;
    }
    
    static makeGradualScales(minScale, maxScale, numPoints) {
        let scaleValues = [];

        let step = (maxScale - minScale) / numPoints;
        for (let scale = minScale; scale <= maxScale ; scale += step) {
            scaleValues.push({x: 0, y: scale, z: 0});
        }

        return scaleValues;
    }
}