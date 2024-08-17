'use strict';

import { Sentence } from "./js/Objects/Sentence.js";
//
import { Ground } from "./js/Objects/Ground.js";
import { Dragon } from "./js/Objects/Dragon.js";
import { Mountain } from "./js/Objects/Mountain.js";
import { Sun } from "./js/Objects/Sun.js";
import { CircleStars } from "./js/Objects/CircleStars.js";
import { Star } from "./js/Objects/Star.js";

import { SpotLight } from "./js/Objects/SpotLight.js";
import { Camera } from "./js/Tools/Camera.js";
//
import { CalcsUtils } from "./js/utils/Calcs.js";
import { Ctx } from "./js/Rendering/GraphicalCtx.js";

/**
 * 
 *  Build a model
 *
 **/
function model(userSentence) {
    //
    // Decorations
    //
    let ground = new Ground({});
    //
    let dragon = new Dragon({color: "crimson", pos_x: 0, pos_y: 200});
    dragon.scale.set(4,0.1,2);
    dragon.rotation.set(0,1 * Math.PI,0);
    //
    let circleStars = new CircleStars({
        numStars: 22,
        startAngle: CalcsUtils.degreesToRadians(-60),
        endAngle: CalcsUtils.degreesToRadians(235),
        size: 1,
    });
    circleStars.rotation.set(0.5 * Math.PI,0,0);
    circleStars.position.set(-10,120,90);
    circleStars.scale.set(5,5,5);
    //
    let mountain = new Mountain({size: 3});
    mountain.scale.set(25 * mountain.size,40 * mountain.size,20 * mountain.size);
    mountain.position.set(-50,20,0);
    //
    let sun = new Sun({pos_x: -700, pos_y: 3000, pos_z: 90});
    sun.scale.set(10,10,10);
    sun.rotation.set(0, 0, 0.5 * Math.PI);
    //
    const amountStars = 500; // advice: reduce the amount if the rendering gets too slow
    let starsArr = [];
    for (let i = 0; i < amountStars; i++) {
        let radius = CalcsUtils.rand_ab(700, 1000);
        let angle = CalcsUtils.rand_ab(0, Math.PI * 2);
        //
        let star = new Star({
            size: 2, 
            pos_x: Math.cos(angle) * radius, 
            pos_y: Math.sin(angle) * radius, 
            pos_z: CalcsUtils.rand_ab(-800, 800)
        });

        starsArr.push(star);
    }
    
    //
    // Letters
    // 
    let sentence = new Sentence({ 
        // text:"andadora", 
        text: userSentence,
        // //
        // sizeWord: 1, 
        // sizeLetter: 7, 
        // sizeSpace: 1, 
        // //
        // rot_x: 0,
        // rot_y: 0,
        // rot_z: 0,
        // //
        pos_x: 46,
        pos_y: -300,
        pos_z: 70,
        // //
        // firstPos_x: 0,
        targetAnimPos: {
            // x: mountain.position.x,
            y: 380,
            // z: mountain.position.z,
        },
    });

    return [
        sentence,
        dragon,
        ground,
        circleStars,
        mountain,
        sun,
        ...starsArr,
    ];
}

/**
 * 
 *  Setup the rendering context
 *
 **/
function init(mesh) {
    //! zz for the height axis!
    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1); 

    //
    //  Scene (World, Model)
    //
    let scene = new THREE.Scene();

    let renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true, // reduce (the almost not present) jagged edges
        physicallyCorrectLights: true,
    });

    let camera = new Camera({
        posToLook: {x: scene.position.x, y: scene.position.y, z: scene.position.z},
        pos_x: 300, 
        pos_y: -80, 
        pos_z: 60
    });
    
    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    let size = Math.min(window.innerWidth - 32, window.innerHeight - 32, 1024);
    renderer.setSize(size, size);
    //
    renderer.setClearColor(`hsl(207, 60%, ${0}%)`); 

    //
    // Setup the graphical context (to display the animation)
    //
    let gc = new Ctx(controls, renderer);
    gc.basket.addEventListener("keypress", (e) => {
        if (e.key == "R" || e.key == "r") controls.reset()
    });
    gc.basket.appendChild(renderer.domElement); // append the element of the DOM (Document Object Model)

    scene.mesh = mesh;
    
    for(let i = 0; i < mesh.length; i++){ // add ALL the objects from the model
        scene.add(mesh[i]);
    }
  
    let fog = new THREE.Fog(0xD6F9FF, 350, 1500);
    scene.fog = fog;

    return {
        camera: camera,
        scene: scene,
        renderer: renderer,
        controls: controls,
    };
}

//
// Animate the model
//
function animate(step, modelTargets) {
    //
    // Sound effects
    //
    modelTargets.entranceAudio.addEventListener('ended', function() {
        modelTargets.entranceAudio.currentTime = 0; // Not needed, I guess
        modelTargets.bgAudio.play();
    });
    modelTargets.entranceAudio.play();

    //
    //  ANIMATION STEP CALLBACK
    //
    let previous = performance.now();
    let animation_step = function animation_step(previous) {
        let now = performance.now();
        let dt = now - previous;
        previous = now;

        modelTargets.totalElapsedTime = now; // miliseconds
        update(step, modelTargets, dt);

        requestAnimationFrame(() => animation_step(previous)); // anonymous function
    }
    requestAnimationFrame(() => animation_step(previous));     // anonymous function 
}

function update(step, modelTargets, dt) {
    
    //
    // Procedural animations
    //
    modelTargets.sun.update(dt); 
   
    // Day and night effect
    let dayLight;
    let angle = modelTargets.sun.angleOrbit % (2 * Math.PI);
    if (angle >= 0 && angle <= (1 * Math.PI)) { // day
        if (angle <= 0.5 * Math.PI) {
            dayLight = +1 * (120 / Math.PI) * angle + 0;
        }
        else {
            dayLight = -1 * (120 / Math.PI) * angle + 120;
        }
    }
    else { //night
        dayLight = 0;
    }
    modelTargets.renderer.setClearColor(`hsl(207, 60%, ${Math.round(dayLight)}%)`);
    
    //
    //  Camera (and TrackballControls)
    //
    step.controls.update();
    step.renderer.render(step.scene, step.camera);

    //
    // Animations controlled by INTERPOLATORS
    //
    TWEEN.update();    
}

function processUserInput () {
    let companyName = document.getElementById("companyNameInput").value;

    // Conversion to lowerCase is already done in the constructor of the Sentence.js
    return companyName.replace(/[^andorANDOR]/g, 'd') || "andadora"; // "d" for default, when the character is NOT in the list of available ones
}

function main() {
    let companyName = processUserInput();
    let step = init(model(companyName));    

    let modelTargets = {
        //
        //  Scene (World, Model)
        //
        sentence: step.scene.mesh.find(obj => obj instanceof Sentence),
        letterA: step.scene.mesh[0],
        circleStars: step.scene.mesh.find(obj => obj instanceof CircleStars),
        sun: step.scene.mesh.find(obj => obj instanceof Sun),

        //
        //  Camera (and TrackballControls)
        //
        camera: step.camera,
        renderer: step.renderer,

        //
        // Miscellaneous
        //
        entranceAudio: document.getElementById('entranceAudio'),
        bgAudio: document.getElementById('bgAudio'),
        totalElapsedTime: performance.now(),
    };
    animate(step, modelTargets);
}

//
// Interface to start the animation
//
document.getElementById("startButton").onclick = function startAnimation() {
    main();
}