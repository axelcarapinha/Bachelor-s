'use strict'; 

import { Player } from "./objects/Player.js";
import { Fugitive } from "./objects/Fugitive.js"
//
import { GraphicalCtx } from "./rendering/GraphicalCtx.js";
import { PointsUtils } from "./Utils/Points.js";
import { CalcsUtils } from "./Utils/Calcs.js";
//
import { JayMoriarity } from "./objects/JayMoriarity.js";
import { Pacman } from "./objects/Pacman.js";
import { ChappelBones } from "./objects/ChappelBones.js";

function getUserInput() {
    return {
        arenaSize: parseInt(document.getElementById("arenaSize").value)     || 300,  // "small"
        playerReach: parseInt(document.getElementById("playerReach").value) || 3,    // player bounds, proximity from the fugitive to consider it catched
        maxTime: parseFloat(document.getElementById("maxTime").value)       || 20,   
        maxVel: parseFloat(document.getElementById("maxVel").value)         || 0.05, // "medium"
        skin: document.getElementById("skinFugitive").value                 || "chappelBones"
    }
}

function init_model() {
    let userSettings = getUserInput();

    let model = {
        //
        // Time attributes
        //
        elapsed: 0,
        frame_count: 0,
        frameRate: 60,
        
        //
        // Rendering settings
        //
        arenaSize: userSettings.arenaSize,
        textDiv: document.getElementById("text"),
        followerSkin: userSettings.skin,

        //
        // Difficulty Settings
        //
        playerReach: userSettings.playerReach, // 1:HARD 2:MEDIUM 3:EASY
        maxTime: userSettings.maxTime, 
        maxVel: userSettings.maxVel,
        targetScore: 3, // 3 pacmen catched to have more time!
        //        
        // catch_distance: 1,
            
        //
        // Sound effects
        //
        startingAudio: document.getElementById("startingAudio"),
        inGameAudio: document.getElementById("inGameAudio"),
        //
        gameOverAudio: document.getElementById("gameOverAudio"),
        gameOverAudioPlayed: false,

        //
        // Miscellaneous
        //
        debug: false,
        isPaused: false,
        isOver: false,
    }
    model.safeDistance = (0.002 * model.arenaSize).toFixed(3);
    
    model.player = new Player({
        vel: 0.2 * model.maxVel,
        skin: new JayMoriarity({})
    });
    //
    model.fugitives = []; 
    let fugitiveSkin = (model.followerSkin === "pacman") ?
        new Pacman({playerReach: model.playerReach}) :
        new ChappelBones({})
    ;
    let amount = 3;
    for (let i = 0; i < amount; i++) {
        model.fugitives.push(
            new Fugitive({
                size: 0.1, 
                vel: 0.2 * model.maxVel,
                randPos: true,
                skin: fugitiveSkin,
                arenaSize: model.arenaSize,
            })
        );
    }    
    
    // Event listeners
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "p": case "P":
                model.isPaused = !model.isPaused;
                break;
            default:
                break;
        }
    });

    return model;
}

function render(model, gc) {
    //
    // Display GAME INFOS
    //
    message(gc, model);
     
    //
    // Render the scene
    //
    let fugitivesGraphs = model.fugitives.map(f => f.getGraph());
    let background = {
        transform: {
            dx: model.arenaSize + (gc.width  / 2) - model.arenaSize,
            dy: model.arenaSize + (gc.height / 2) - model.arenaSize, 
            sx: model.arenaSize,
            sy: model.arenaSize,
            a: 0 * Math.PI,
        },    
        style: {fill: "skyblue"},    
        shape: PointsUtils.rect_path(),
        children: [
            model.player.getGraph(model),
            //
            ...fugitivesGraphs,  
        ],  
    };
    
    let svg_element = draw_figure(background, gc.width, gc.height);
    gc.basket.innerHTML = svg_element.outerHTML;
}

function message(gc, {textDiv,maxTime, isOver, isPaused, elapsed, player, debug, frameRate, frame_count}) { // model object destructuring
    //
    // Show execution data
    //
    const SEPARATOR = " | ";
    let text = 
        `Remaining time: ${(isOver) ? maxTime : Math.round(elapsed)}/${maxTime} s` + SEPARATOR + 
        `SCORE: ${player.score}`
    ; 
    
    if (isPaused && !isOver) {
        text += SEPARATOR + " PAUSED";
        // textDiv.innerHTML = "PAUSED";
    }
    if (isOver) {
        text += SEPARATOR + " FINISHED";
        if(player.score >= 333) text+= " -Billy Mitchell, is that you?!"
    }
    //
    if (debug) {
        text = text + SEPARATOR + 
            `FPS: ${frameRate.toFixed(3)}` + SEPARATOR + 
            `FRAME COUNT: ${frame_count}` +  SEPARATOR
        ;
    }

    gc.terminal.innerHTML = text;
}

function updateAudio(model) {
    model.startingAudio.addEventListener('ended', function() {
        model.startingAudio.currentTime = 0; // precaution measure
        // model.startingAudio.ended = true;
        model.inGameAudio.play();
    });
    
    if (model.isOver && !model.gameOverAudioPlayed) {
        model.inGameAudio.currentTime = 0; 
        model.inGameAudio.pause();

        model.gameOverAudio.play();
        model.gameOverAudioPlayed = true;
    }
    //
    if(model.isPaused) {
        model.inGameAudio.pause();
    }
    else if (model.startingAudio.ended){
        model.inGameAudio.play(); // resume the audio
    }
}

function update(model, dt, gc) {
    //
    // Update Event Listeners
    //
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            // ESC resets this choice to nothing
            case "w": case "W": model.player.action = 1; break;
            case "s": case "S": model.player.action = 2; break;
            case "d": case "D": model.player.action = 3; break;
            case "a": case "A": model.player.action = 4; break;
            //
            case "p": case "P": model.paused = -model.paused;
            //
            default: model.player.action = 0; break;
        }
    });
    //
    let message = document.getElementById("message");
    gc.message = (text) => {
        message.innerHTML = text;
    };

    //
    // Update OBJECTS
    //
    model.player.update();
    //
    for (let i = 0; i < model.fugitives.length; i++) {
        let f = model.fugitives[i];
        f.update(model, dt);
        //
        if (f.isHunted) {
            model.player.score++;

            // model.fugitives.splice(i, 1);
            model.fugitives = model.fugitives.filter(f => f.isHunted === false);
            
            let newF = (new Fugitive({
                randPos: true, 
                vel: 0.2 * model.maxVel,
                skin: (model.followerSkin === "pacman") ?
                    new Pacman({playerReach: model.playerReach}) :
                    new ChappelBones({})
                ,
                arenaSize: model.arenaSize,
            }));
            //
            model.fugitives.splice(i,0,newF);
        }
    }

    if (model.player.score === model.targetScore) {
        model.targetScore += 3;
        model.maxTime += 10;
    }

    return model;
}

function animate(gc) {
    //
    //  INITIAL MODEL
    //
    let model = init_model();

    //
    // Start the sound effects
    //
    model.startingAudio.play();

    //
    //  ANIMATION STEP CALLBACK
    //
    let now = performance.now();
    let previous = performance.now();
    function animation_step(previous) {
        
        //
        // Update TIME data
        //
        now = performance.now();
        let dt = now - previous;
        previous = now;
        //
        
        if (model.elapsed >= model.maxTime) model.isOver = true;
        
        if (!model.isPaused && !model.isOver && model.startingAudio.currentTime === 0) {
            model.elapsed += dt / 1000;
            model = update(model, dt, gc);
        }
        
        //
        // Update SOUNDS 
        //
        updateAudio(model);
        
        render(model, gc);
        requestAnimationFrame(() => animation_step(previous));
    };
    requestAnimationFrame(() => animation_step(previous)); // START THE ANIMATION LOOP
}

function draw_figure(fig) {
    let svg;

    //! ESTOU AQUI
    // Use directly imported SVG code
    if (fig.hasOwnProperty("imported")) {
        return fig.importedSvgCode;
    }

    if (!fig.isChild) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', "100%");
        svg.setAttribute('height', "100%");
        // viewBox_size = viewPort_size by default
    }

    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    if (fig.hasOwnProperty("transform")) {
        let transformStr = `translate(${(fig.transform.dx || 0)},${(fig.transform.dy || 0)}) scale(${fig.transform.sx || 1},${fig.transform.sy || 1}) rotate(${CalcsUtils.radiansToDegrees(fig.transform.a) || 0})`;
        group.setAttribute('transform', transformStr);
    }
    
    if (fig.hasOwnProperty("style")) {
        if (fig.style.hasOwnProperty("fill")) {
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute('d', build_path(fig.shape));
            path.setAttribute('fill', fig.style.fill);
            path.setAttribute('stroke', fig.style.stroke);
            path.setAttribute('stroke-width', fig.style.lineWidth);
            path.setAttribute('fill-style', fig.fillStyle); // to support the CSS gradient of Jay's board
            group.appendChild(path);
        }
    }
    //
    //! ESTOU MESMO AQUI
    if (fig.hasOwnProperty("linearGradient")) {
        let linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        linearGradient.setAttribute('id', `${fig.linearGradient.id}`);
        linearGradient.setAttribute('x1', `${fig.linearGradient.x1}`);
        linearGradient.setAttribute('x2', `${fig.linearGradient.x2}`);
        linearGradient.setAttribute('y1', `${fig.linearGradient.y1}`);
        linearGradient.setAttribute('y2', `${fig.linearGradient.y2}`);

        for (let stop of fig.linearGradient.stops) {
            let stopElement = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stopElement.setAttribute('offset', stop.offset);
            stopElement.setAttribute('stop-color', stop.color);
            linearGradient.appendChild(stopElement);
        }

        group.appendChild(linearGradient);
    }
    
    if (fig.hasOwnProperty("children")) {
        for (let child of fig.children) {
            child.isChild = true;
            let svg_child = draw_figure(child);
            group.appendChild(svg_child);
        }
    }

    if (!fig.isChild) {
        svg.appendChild(group);
        return svg;
    }

    return group;
}

function build_path(points) {
    let path_spec = "";
    if (points.length > 0) {
        let start_point = points.shift();
        path_spec = `M ${start_point.x} ${start_point.y}`;
        for (let point of points) path_spec += ` L ${point.x} ${point.y}`;

        path_spec += " Z";
    }

    return path_spec;
}

function main() {
    console.log("I'm alive!");

    //
    //  SETUP GRAPHICS CONTEXT
    //
    let gc = new GraphicalCtx();

    //
    //  ANIMATE
    //
    animate(gc);
}

document.getElementById("startButton").onclick = function startGame() {
    // location.reload(); // if the user presses START when the game has NOT finished yet
    alert(
        "3 pacmen catched = +10 seconds" + "\n" + 
        "WASD for controls" + "\n" + 
        "Good luck ;)"
    );
    main();
}