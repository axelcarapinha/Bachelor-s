'use strict'; 

//
// Objects
//
import { Leader } from "./objects/Leader.js";
import { Follower } from "./objects/Follower.js";
import { Boat } from "./objects/Boat.js";
import { Cloud } from "./objects/Cloud.js";
import { Island } from "./objects/Island.js";
import { Sun } from "./objects/Sun.js";

//
// Utils
//
import { PointsUtils } from "./Utils/Points.js";
import { GraphicalCtx } from "./rendering/GraphicalCtx.js";

function init_model() {
    let model = {};

    model = {
        //
        // Speed attributes
        //
        count: 0,
        time: 0,
        elapsed: 0,

        // 
        // Main characters
        //
        leader: new Leader({vehicle: new Boat()}),

        follower: new Follower({}), // create default follower

        //
        // Background Decorations
        //
        sun: new Sun(),
        //
        cloudRate: 1000,
        clouds: [],
        //
        islandRate: 5000,
        islands: [],

        //
        // Miscellaneous
        //
        debug: true,
        isPaused: false,
        bgAudio: document.getElementById('bgAudio'),
    }

    //
    // Load the Vinil image 
    //
    model.bgDecoration = {
        image: new Image(),
        isImageLoaded: false,
    };
    model.bgDecoration.image.src = "../../assets/images/vinil.png";

    model.bgDecoration.image.onload = function() {
        model.bgDecoration.isImageLoaded = true;
    };
    model.bgDecoration.onload = () => {};

    // 
    // Listen to keyboard interruptions
    //
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "t": case "T": 
                model.isTKeyHeld = true;
                break;
            case "p": case "P":
                model.isPaused = !model.isPaused;
                            
                break;
            default:
                break;
        }
    });

    document.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "t": case "T": 
                model.isTKeyHeld = false;
                break;
            default: 
                break;
        }
    });

    return model;
}

function render(model, gc) {
    //
    // Show execution data
    //
    const SEPARATOR = " | ";
    let text = 
        `Paused: ${model.isPaused}` + SEPARATOR + 
        `Elapsed: ${Math.round(model.elapsed)}ms` + SEPARATOR
    ; 

    if (model.debug) {
        text = text + `FRAME COUNT: ${model.count}`    + SEPARATOR
                    + `Clouds: ${model.clouds.length}` + SEPARATOR
                    + `Islands: ${model.islands.length}`
        ;
    }

    gc.message(text);
    
    //
    // Color gradients
    //
    const BLUE1 = `hsl(197, 98%, 29%)`;
    const BLUE2 = `hsl(192, 61%, 54%)`;
    const SEASIDE_COLOR = gc.createLinearGradient(0.5,0,0.5,1);
    SEASIDE_COLOR.addColorStop(0, BLUE1);
    SEASIDE_COLOR.addColorStop(1, BLUE2);

    const CLOUD_BLUE  = `hsla(206, 89%, 80%, 0.9)`;
    const CLOUD_WHITE = `hsla(204, 87%, 93%, 0.9)`;
    const CLOUD_COLOR = gc.createLinearGradient(3.36,3.88,2.25,1.64);
    CLOUD_COLOR.addColorStop(0, CLOUD_BLUE);
    CLOUD_COLOR.addColorStop(1, CLOUD_WHITE);

    gc.enter(0, 0, gc.canvas.width, gc.canvas.height, 0);

    //
    // Background
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
    gc.draw_figure(background);

    //
    // Displaying the image
    //
    gc.drawImage(model.bgDecoration.image, 0.35, 0, gc.canvas.width / 2000, gc.canvas.height / 2000);

    // 
    // Drawing the other figures
    //
    figs.push(model.follower.getGraph(model));
    figs.push(parasRope);
    //  
    model.clouds.forEach(
        cloud   => figs.push(cloud.getGraph({color: CLOUD_COLOR}))
    );
    //
    model.islands.forEach(
        island => figs.push(island.getGraph())
    );
    //
    figs.push(model.leader.vehicle.getGraph(model));
    //
    figs.forEach(
        fig => gc.draw_figure(fig)
    );


    gc.leave();
}

function updateClouds(model,dt) {
    if (model.count % model.cloudRate === 0) {
        model.clouds.push(new Cloud({}));
    }

    // Removes the CLOUDS out of sight
    for (let i = 0; i < model.clouds.length; i++) {
        let cloud = model.clouds[i];

        cloud.update(dt); 
        model.clouds.filter(c => !c.isNotVisible);
        if (cloud.isHidden) {
            model.clouds.splice(i, 1);
        }
    }
}

function updateIslands(model, dt) {
    if (model.count % model.islandRate === 0) {
        model.islands.push(new Island({}));    
    }
    
    // Removing the ISLANDS out of sight
    for (let i = 0; i < model.islands.length; i++) {
        let island = model.islands[i];

        island.update(dt);
        if (island.isHidden) {
            model.islands.splice(i, 1);
        }
    }
}

function update(model, dt) {
    //
    // Update OBJECTS
    //
    model.follower.update(dt, model); 
    model.sun.update(dt);
    updateClouds(model, dt);
    updateIslands(model, dt);

    //
    // Update the boat (that has the leader)
    //
    TWEEN.update();
    
    // Draw the symetrical version when going in the opposite direction
    if (model.leader.x < -0.7) {
        model.leader.sx = -1 * 0.5 * model.leader.size;
        model.leader.sy = +1 * 0.5 * model.leader.size;
    }
    else if (model.leader.x > 1.4) {
        model.leader.sx = +1 * 1.5 * model.leader.size;
        model.leader.sy = +1 * 1.5 * model.leader.size;
        model.follower.sx *= -1;
    }
    //
    if (model.follower.x  < -0.7) {
        model.follower.sx = -0.5 * model.follower.size;
        model.follower.sy = +0.5 * model.follower.size;
        //
        model.follower.y = model.follower.first_pos_y -0.0002;
    }
    else if(model.follower.x > 1.4) {
        model.follower.sx = +1.5 * model.follower.size;
        model.follower.sy = +1.5 * model.follower.size;
        //
        model.follower.y = model.follower.first_pos_y +0.0002;
    }
  
    //
    // Update Event Listeners
    //
    if(model.isTKeyHeld) {
        model.leader.color = "white";
    }
    else {
        model.leader.color = "blue";
    }

    //
    // Update background music
    //
    if (model.bgAudio.paused) {
        model.bgAudio.play();
    }

    return model;
}

function animate(gc) {
    //
    //  INITIAL MODEL
    //
    let model = init_model();

    //
    // Star the background music
    //
    model.bgAudio.play();

    let now = performance.now();                      
    let previous = performance.now(); 
    //
    //  ANIMATION STEP CALLBACK
    //
    function animation_step(previous) {
        now = performance.now();
        let dt = now - previous; 
        previous = now;

        model.count += 1;                               
        model.time = now * 1000;
        model.elapsed = dt;

        if (!model.isPaused) {
            model = update(model, dt);
        }
        else {
            model.bgAudio.pause();
        }

        gc.render(model, gc);

        requestAnimationFrame(() => animation_step(previous));
    };
    requestAnimationFrame(() => animation_step(previous)); // START THE LOOP
}

function main() {
    console.log("I'm alive!");
    alert(
        "'P' pauses the animation" + "\n" + 
        "'T' changes the color of the boat"
    );
    //
    //  SETUP GRAPHICS CONTEXT
    //
    let gc = new GraphicalCtx().ctx;
    gc.render = render;

    let message = document.getElementById("terminal");
    gc.message = (text) => { message.innerHTML = text; }

    gc.canvas.width = 700;
    gc.canvas.height = 700;

    //
    //  ANIMATE
    //
    animate(gc);
}

main();
