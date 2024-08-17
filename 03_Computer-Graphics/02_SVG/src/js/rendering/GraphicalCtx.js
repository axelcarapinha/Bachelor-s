export class GraphicalCtx {
    static NUM_POINTS_CURVES = 200;
    static boardGradient;

    constructor() {
        //
        // HTML elements (to send output)
        //
        this.basket = document.getElementById("basket");
        this.width = this.basket.clientWidth;
        this.height = this.basket.clientHeight;
        //
        this.terminal = document.getElementById("terminal");
    }
}
