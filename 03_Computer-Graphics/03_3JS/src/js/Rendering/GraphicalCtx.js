export class Ctx {
    constructor(controls, renderer) {
        if (controls === null) throw new Error("Null controls.");
        if (renderer === null) throw new Error("Null renderer.");

        this.basket = document.getElementById("container");
    }
    
    //
    // Default rendering values
    //
    static NUM_POINTS_CURVES = 200;
    static DEEPNESS = 0.5;

    static draw_figure(fig) {
        let path = undefined;

        if (fig.hasOwnProperty("shape")) {
            path = new THREE.Shape();
            path.moveTo(fig.shape[0].x, fig.shape[0].y);
            for (let p of fig.shape.slice(1)) {
                path.lineTo(p.x, p.y);
            }
        }

        return path;
    }
}