import { Turtle } from "./Turtle.js";

export class PointsUtils {

    //
    //** Making (basic) paths **/ 
    //
    static rect_path() {
        return [
            {x: -1, y: -1}, 
            {x:  1, y: -1},
            {x:  1, y:  1},
            {x: -1, y:  1},
            {x: -1, y: -1}
        ]
    }

    static star_path(n, r) {
        let angle_step = 2 * Math.PI / (2 * n);
        let p = new Array();
        let angle = 0.0;
        for (let i = 0; i < 2 * n; i++) {
            angle += angle_step;
            let x = Math.cos(angle);
            let y = Math.sin(angle);
            if (i % 2 === 0) {
                x = r * x;
                y = r * y;
            }
            p.push({x: x, y: y});
        }
        return p;
    }

    static sector_path(num_points, start_angle, end_angle) {
        let step = (end_angle - start_angle) / (num_points - 1);
        let points = new Array(num_points);
        let angle = start_angle;
        for (let i = 0; i < num_points; i++) {
            points[i] = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            };
            angle += step;
        }
        return points;
    }


    static pie_path(points) {
        let o = [{x: 0, y: 0}]
        return o.concat(points).concat(o);
    }

    static triangle_path () {
    //! Star path gera QUASE todo o traço do redor, mas não todo  
    // return star_path(3,2);

        return [
            {x:0, y:0},
            {x:1, y:0},
            {x:0.5, y:-1},
            {x:0, y:0}
        ];
    }

    static circle_path() { return this.sector_path(250, 0, 2 * Math.PI); }
   
    static quadraticBezierCurve_path(startPoint, controlPoint, endPoint, numPoints) {
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;

            // a**b = a^b
            const x = (1 - t)**2 * startPoint.x + 2 * (1 - t) * t * controlPoint.x + Math.pow(t, 2) * endPoint.x;
            const y = (1 - t)**2 * startPoint.y + 2 * (1 - t) * t * controlPoint.y + Math.pow(t, 2) * endPoint.y;
            points.push({ x, y });
        }
        return points;
    }

    static cubicBezierCurve_path(startPoint, controlPoint1, controlPoint2, endPoint, numPoints) {
        const points = [];
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const a = 1 - t;
            
            const x = a ** 3 * startPoint.x + 3 * a ** 2 * t * controlPoint1.x +
                    3 * a * t ** 2 * controlPoint2.x + t ** 3 * endPoint.x;
            
            const y = a ** 3 * startPoint.y + 3 * a ** 2 * t * controlPoint1.y +
                    3 * a * t ** 2 * controlPoint2.y + t ** 3 * endPoint.y;
            
            points.push({ x, y });
        }

        return points;
    }    

    static elipse_path(a, b, numPoints) {
        let points = [];

        for (let i = 0; i < numPoints; i++) {
            const theta = (i / numPoints) * 2 * Math.PI;
            const x = a * Math.cos(theta);
            const y = b * Math.sin(theta);
            points.push({ x, y });
        }

        return points;
    }

    static nagon_path(n) {
        let points = new Array(n);
        let step_angle = 2.0 * Math.PI / n;
        let angle = 0.0;
        for (let i = 0; i < n; i++) {
            points[i] = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
            angle = angle + step_angle;
        }
        return points;
    }


    //
    //** L-system paths **/ 
    //
    static KochLSystPath(numPoints) {
        numPoints = numPoints || 2;
        let turtle = new Turtle();
        return turtle.ls_turtle(turtle.koch_curve(), numPoints, turtle).points;
    }
    static DragonLsystPath(numPoints) {
        numPoints = numPoints || 2;
        let turtle = new Turtle();
        return turtle.ls_turtle(turtle.dragon_curve(), numPoints, turtle).points;
    }
    static SierpArrLsystPath(numPoints) {
        numPoints = numPoints || 2;
        let turtle = new Turtle();
        return turtle.ls_turtle(turtle.sierpinski_arrowhead(), numPoints, turtle).points;
    }
    static SierpTriLsystPath(numPoints) {
        numPoints = numPoints || 2;
        let turtle = new Turtle();
        return turtle.ls_turtle(turtle.sierpinski_triangle(), numPoints, turtle).points;
    }
    static AxelLsystPath(numPoints) {
        numPoints = numPoints || 2;
        let turtle = new Turtle();
        return turtle.ls_turtle(turtle.axel_path(), numPoints, turtle).points;
    }

    //
    //** Transformating the paths **/ 
    //
    static #rotatePoint(point, angle, center) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const translatedX = point.x - center.x;
        const translatedY = point.y - center.y;

        const rotatedX = translatedX * cosA - translatedY * sinA;
        const rotatedY = translatedX * sinA + translatedY * cosA;

        return {
            x: rotatedX + center.x,
            y: rotatedY + center.y
        };
    }

    static rotatePoints(points, angle, center) {
        return points.map(point => this.#rotatePoint(point, angle, center));
    }

    static reflectAcrossAxis(points, axisStart, axisEnd) {
        // slope = a = (yb - ya) / (xb - xa)
        const axisSlope = (axisEnd.y - axisStart.y) / (axisEnd.x - axisStart.x);
        const axisIntercept = axisStart.y - axisSlope * axisStart.x;
    
        // Reflect across the axis
        return points.map(point => {
            // Calculates the perpendicular line passing through the point
            const perpendicularSlope = -1 / axisSlope;
            const perpendicularIntercept = point.y - perpendicularSlope * point.x;
    
            // Calculates the intersection point of the two lines
            const x = (axisIntercept - perpendicularIntercept) / (perpendicularSlope - axisSlope);
            const y = perpendicularSlope * x + perpendicularIntercept;
    
            // Calculates the oposite side of the point 
            const reflectedX = 2 * x - point.x; 
            const reflectedY = 2 * y - point.y;
    
            return { x: reflectedX, y: reflectedY };
        });
    }

    static pie(points) {
        let o = [{x: 0, y: 0}]
        return o.concat(points).concat(o);
    }
}