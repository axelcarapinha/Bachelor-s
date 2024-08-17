export class GraphicalCtx {
    static NUM_POINTS_CURVES = 250;

    constructor() {
        this.ctx = document.getElementById("canvas").getContext("2d")
        
        // Expand context
        this.ctx.draw_figure = this.draw_figure.bind(this.ctx);
        this.ctx.enter = this.enter.bind(this.ctx);
        this.ctx.leave = this.leave.bind(this.ctx);
        this.ctx.render = this.render.bind(this.ctx);
    }

    render(model) {
        //
        // Show execution data
        //
        const SEPARATOR = " | ";
        let text = 
            `Paused: ${model.paused}` + SEPARATOR + 
            `Elapsed: ${Math.round(model.elapsed)}ms` + SEPARATOR
        ; 

        if (model.debug) {
            text = text + `FPS: ${Math.round(1000 * model.count / model.time)}` + SEPARATOR 
                        + `FRAME COUNT: ${model.count}`    + SEPARATOR
                        + `Clouds: ${model.clouds.length}` + SEPARATOR
                        + `Islands: ${model.islands.length}`
            ;
        }

        // this.ctx.message(text);
        
        //
        // Define Color gradients
        //
        const BLUE1 = `hsl(197, 98%, 29%)`;
        const BLUE2 = `hsl(192, 61%, 54%)`;
        const SEASIDE_COLOR = this.ctx.createLinearGradient(0.5,0,0.5,1);
        SEASIDE_COLOR.addColorStop(0, BLUE1);
        SEASIDE_COLOR.addColorStop(1, BLUE2);

        const CLOUD_BLUE  = `hsla(206, 89%, 80%, 0.9)`;
        const CLOUD_WHITE = `hsla(204, 87%, 93%, 0.9)`;
        const CLOUD_COLOR = this.ctx.createLinearGradient(3.36,3.88,2.25,1.64);
        CLOUD_COLOR.addColorStop(0, CLOUD_BLUE);
        CLOUD_COLOR.addColorStop(1, CLOUD_WHITE);

        //TODO:
        // this.ctx.enter_ref(0.1, 0.5, 0.002, 0.002, 0);
        // this.ctx.fillStyle = "blue";
        // this.ctx.font = "48px serif";
        // this.ctx.fillText("Hello World", 0, 0);
        // this.ctx.strokeStyle = "crimson";
        // this.ctx.strokeText("Hello World", 0, 0);
        // this.ctx.leave_ref();

        this.ctx.enter(0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0);

        //
        // Draw the background
        //
        let figs = [];

        let background = {
            transform: {
                dx: 0, 
                dy: 0, 
                sx: 1, 
                sy: 1,
                a: 0 * Math.PI,
            },    
            style: {
                fill: "skyblue",
                stroke: "skyblue",
                lineWidth: 0.3,
            },    

            shape: PointsUtils.rect_path(),
            children: [
                
                // Sun
                model.sun.getGraph(model),
                
                // Ocean
                {
                    transform: {
                        dx: 0.5, 
                        dy: 0.7, 
                        sx: 0.5, 
                        sy: 0.3,
                        a: 1 * Math.PI,
                    },    
                    style: {
                        fill: SEASIDE_COLOR,
                        stroke: SEASIDE_COLOR,
                        lineWidth: 0.1,
                    },    
            
                    shape: PointsUtils.rect_path(),
                },
            ]
        };

        //
        // Objects
        //
        let parasRope = {
            transform: {
                dx: 0, 
                dy: 0, 
                sx: 1,
                sy: 1,
                // sx: model.leader.sx * (100 / 8), 
                // sy: model.leader.sy * (100 / 8),
                a: 0,
            },
            style: {
                fill: "white",
                stroke: "white", 
                lineWidth: 0.002,
            },
            shape: [
                {x: model.leader.x   + (model.leader.sx   * 4.8), y: model.leader.y   + (model.leader.sy   * 2.3)}, 
                {x: model.follower.x + (model.follower.x * 0.0), y: model.follower.y + (model.follower.y * 2.0)}
            ],
        };

        //
        // Drawing the background
        //

        this.ctx.draw_figure(background);

        //
        // Displaying the image
        //
        this.ctx.drawImage(model.bgDecoration.image, 0.35, 0, this.ctx.canvas.width / 2000, this.ctx.canvas.height / 2000);

        // 
        // Drawing the other figures
        //
        figs.push(model.follower.getGraph(model));
        figs.push(parasRope);
            
        model.clouds.forEach(
            cloud   => figs.push(cloud.getGraph({color: CLOUD_COLOR}))
        );

        model.islands.forEach(
            island => figs.push(island.getGraph())
        );

        figs.push(model.leader.vehicle.getGraph(model));

        figs.forEach(
            fig => this.ctx.draw_figure(fig)
        );

        //TODO importar o Jay moriarity a surfar ao longe

        this.ctx.leave();
    }

    //
    // Drawing functions
    //
    draw_figure(fig) {
        if (fig.hasOwnProperty("transform")) {
            this.enter(
                fig.transform.dx || 0,
                fig.transform.dy || 0,
                fig.transform.sx || 1,
                fig.transform.sy || 1,
                fig.transform.a  || 0,
                );
        }

        let path = undefined;
        if (fig.hasOwnProperty("shape")) {
            path = new Path2D();
            path.moveTo(fig.shape[0].x, fig.shape[0].y);
            for (let p of fig.shape.slice(1)) {
                path.lineTo(p.x, p.y);
            }
        }

        if (fig.hasOwnProperty("style")) {
            if (fig.style.hasOwnProperty("lineWidth")) {
                this.lineWidth = fig.style.lineWidth;
            }
            if (fig.style.hasOwnProperty("fill")) {
                this.fillStyle = fig.style.fill;
                if (path !== undefined) this.fill(path);
            }
            if (fig.style.hasOwnProperty("stroke")) {
                this.strokeStyle = fig.style.stroke;
                if (path !== undefined) this.stroke(path);
            }
        }

        if (fig.hasOwnProperty("children")) {
            for (let child of fig.children) this.draw_figure(child);
        }

        if (fig.hasOwnProperty("transform")) this.leave();
    }

    enter(x, y, sx, sy, a) {
        this.save();
        this.translate(x, y);
        this.scale(sx, sy);
        this.rotate(a);
    }
    //
    leave() {
        this.restore();
    }
}


