export class CalcsUtils {

    static rand_ab(a, b) {
        return a + (b-a) * Math.random();
    }

    static rand_cr(c, r) {
        return c + r * (Math.random() * 2 - 1);
    }

    static dist (v,t) {
        v.x = v.x || 0; t.x = t.x || 0;
        v.y = v.y || 0; t.y = t.y || 0;
        v.z = v.z || 0; t.z = t.z || 0;

        return Math.hypot(v.x - t.x, v.y - t.y, v.z - t.z);
    }    
   
    static degreesToRadians = (degrees) => (degrees * Math.PI) / 180.0;
    static radiansToDegrees = (radians) => (radians * 180.0)   / Math.PI;

    static clip(x, a, b) { return x < a ? a : (x > b ? b : x); }


}