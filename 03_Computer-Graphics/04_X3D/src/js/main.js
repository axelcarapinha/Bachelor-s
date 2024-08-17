'use strict';

//
import { Rocket } from "./Objects/Rocket.js";
import { Ground } from "./Objects/Ground.js";
import { DecorativeTimer } from "./Objects/DecorativeTimer.js";
//
import { Earth } from "./Objects/Earth.js";
import { Star } from "./Objects/Star.js";
import { Jupiter } from "./Objects/Jupiter.js";
import { Moon } from "./Objects/Moon.js";
import { Venus } from "./Objects/Venus.js";
//
import { CalcsUtils } from "./utils/Calcs.js";
import { GraphicalCtx } from "./Rendering/GraphicalCtx.js";
import { Viewpoint } from "./Rendering/Viewpoint.js";
import { Animation } from "./Rendering/Animation.js";

function render_x3d(model) {
    let element = document.createElementNS(
        "http://www.web3d.org/specifications/x3d-namespace",
        model.tag);

    if (model.hasOwnProperty("children")) {
        for (let child_spec of model.children) { 
            let child = render_x3d(child_spec);
            element.appendChild(child);
        }
    }

    if (model.hasOwnProperty("attributes")) {
        for (let attr in model.attributes) {  
            element.setAttribute(
                attr,
                model.attributes[attr]);
        }
    }

    return element;
}

function init_model() {    

    //
    // Animation tools
    //
    let navigationInfo = {
        tag: 'navigationInfo',
        attributes: {
            headlight: "false"
        }
    };
    //
    let viewpoint = new Viewpoint({});

    let spotlight = {
        tag: 'spotLight',
        attributes: {
            DEF: "spotlight",
            // radius: `${}`,
            // intensity: "2.5",
            location: `${10} ${0} ${10}`,
            direction: `-0.5 0.0 -0.5`,
            radius: 20,
            intensity: "0.7",
            on: "false"
        }
    };

    //
    // Parts of the model
    //
    let ground = new Ground({pos_x: 0, pos_y: 0, pos_z: 0, color: `${0 / 255} ${255 / 255} ${4 / 255}`}); // light green
    
    let earth = new Earth({radius: 0.5, center: {x: 0, y: 4, z: 10}});

    // 6356 = earthPolarRadius, 1736 = moonPolarRadius (font: "Moon Fact Sheet - the NSSDCA")
    let proportion = 1736 / 6356;
    let moon = new Moon({radius: proportion * earth.radius});

    let jupiter = new Jupiter({
        radius: (69911 / 6371) * earth.radius,  // proportion
        // center: {x:0, y: 0, z: 714E6 / 6371 * earth.radius}
        center: {x: 0, y: 0, z: 200}
    });

    let venus = new Venus({
        radius: (6051 / 6356) * earth.radius,
        center: {x:2, y: 0, z: -15}
    });

    const amountStars = 500; // reduce the amount of stars in case of a slow animation
    let starsArr = [];
    for (let i = 0; i < amountStars; i++) {
        let radius = CalcsUtils.rand_ab(70, 1000);
        let angle = CalcsUtils.rand_ab(0, Math.PI * 2);
        //
        let pos_x = Math.cos(angle) * radius;
        let pos_y = Math.sin(angle) * radius;

        let star = new Star({
            radius: 0.5, 
            center: { x: pos_x, y: pos_y, z: CalcsUtils.rand_ab(-200, 200)},
            hasLight: false, // for performance
        });

        starsArr.push(star.getGraph());
    }
    //
    let starsController = {
        tag: 'transform',
        attributes: {
            DEF: "starsController",
            translation: "0 0 0",
            scale: "1 1 1",
            render: "false", // to trigger the animtion in a specific moment
            rotation: `1 0 0, ${0.5 * Math.PI}`,
        },
        children: starsArr, 
    };

    let distEarthSun = 15E7 / 6371; // distSun in earth radius
    let sun = new Star({id: "sun", radius: 109 * earth.radius, center: {x: 1, y: 20, z: distEarthSun * earth.radius}, hasLight: true});
 
    let rocket = new Rocket({earthRadius: earth.radius, earthCenter: earth.center, planetRotP: earth.rotPeriod});

    let decorativeTimer = new DecorativeTimer({size: 1});

    //
    // Model (Scene, World, ...)
    //
    let model = {
        tag: 'scene',
        children: [

            //
            // Rendering tools
            //
            navigationInfo,
            //
            viewpoint.getGraph(),
            ...viewpoint.getAnimationArr({orbitCenter: earth.center}),
            //
            spotlight,
            
            //
            // Scene
            //
            {
                tag: "Background",
                attributes: {
                    DEF: "background",
                    skycolor: `${0 / 255} ${157 / 255} ${255 / 255}`, // light blue
                    transparency: "0"
                }
            },

            ground.getGraph(),

            earth.getGraph(),
            ...earth.getAnimationArr({}),
            //
            moon.getGraph({}),
            ...moon.getAnimationArr({
                hasOrbitAnim: true, 
                orbitRadius_x: earth.radius + 2, 
                orbitRadius_y: earth.radius + 1.5, // elliptical orbit of the moon
                orbitCenter: earth.center,
            }), // passing radius and center separatly to not confuse things in the planet class
            
            jupiter.getGraph({}),
            ...jupiter.getAnimationArr({}), // has axial rotation by default

            venus.getGraph({}),
            ...venus.getAnimationArr({ // axial rotation almost imperceptible, but present
            }),

            sun.getGraph(),
            ...sun.getAnimationArr({}), // almost imperceptible, but present
        
            starsController, // already INCLUDES the stars

            rocket.getGraph({}),
            ...rocket.getAnimationArr({
                hasAxialRotAnim: true,
                rotValues: "0 0 1",
                //
                hasOrbitAnim: true, 
                orbitRadius_x: earth.radius * 4, 
                orbitRadius_y: earth.radius * 4, 
                orbitCenter: {
                    x: earth.center.x, 
                    y: earth.center.y + 0.3, 
                    z: earth.center.z,
                },
                //
                isEnabled: "false", // to control the timeSensor with MY time measures
                //
                hasAssemble: true, // allows to the definition of the starting animation
            }),

            ...decorativeTimer.getGraphArr({size: 2}),
        ],
    }

    return model;
}

function animate(gc, model) {
    // 
    // Start the music
    //
    document.addEventListener('DOMContentLoaded', function () {
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.play();
    });

    //
    // Render
    //
    let x3d_element = render_x3d(model);
    gc.basket.appendChild(x3d_element);

    //
    // Animation targets
    //
    let animTargets = { // Found by its DEFs
        //
        // Anmation tools
        //
        viewpoint: x3d_element.querySelector('[DEF="viewpoint"]'),
        viewpointTimeSensor: x3d_element.querySelector('[DEF="viewpointOrbitTicToc"]'),
        //
        spotlight: x3d_element.querySelector('[DEF="spotlight"]'),
        
        //
        // Parts of the model
        // 
        background: x3d_element.querySelector('[DEF="background"]'),
        //
        rocket: x3d_element.querySelector('[DEF="rocket"]'),
        rocketFinsCircle0: x3d_element.querySelector('[DEF="flame01"]'), //TODO ver para que serve esta
        rocketOrbitTimeSensor: x3d_element.querySelector('[DEF="rocketOrbitTicToc"]'),
        rocketRotationTimeSensor: x3d_element.querySelector('[DEF="rocketAxialRotTictoc"]'),
        //
        decorativeTimer: x3d_element.querySelector('[DEF="decorativeTimer"]'),
        //
        starsController: x3d_element.querySelector('[DEF="starsController"]'),
        //
        earth: x3d_element.querySelector('[DEF="earth"]'),
        //
        moon: x3d_element.querySelector('[DEF="moon"]'),
        moonTimeSensor: x3d_element.querySelector('[DEF="moonOrbitTicToc"]'),
        //
        jupiter: x3d_element.querySelector('[DEF="jupiter"]'),
        //
        venus: x3d_element.querySelector('[DEF="venus"]'),
        //
        sun: x3d_element.querySelector('[DEF="sun"]'),
        sunlight0: x3d_element.querySelector('[DEF="sunPointlight0"]'),
        sunlight1: x3d_element.querySelector('[DEF="sunPointlight1"]'),
        sunlight2: x3d_element.querySelector('[DEF="sunPointlight2"]'),
        sunlight3: x3d_element.querySelector('[DEF="sunPointlight3"]'),
        //
        ground: x3d_element.querySelector('[DEF="ground0"]'),
        //
        bodyTimeSensor: x3d_element.querySelector('[DEF="rocketBodyTubeInterpolationTicToc"]'),
        noseConeTimeSensor: x3d_element.querySelector('[DEF="rocketNoseConeInterpolationTicToc"]'),
        windowTimeSensor: x3d_element.querySelector('[DEF="rocketWindowFrameInterpolationTicToc"]'),
        //
        flamesController: x3d_element.querySelector('[DEF="rocketFlamesController"]'),
    };
    
    //
    //  ANIMATION STEP CALLBACK
    //
    let previous = performance.now();
    let animation_step = function animation (previous) {
        //
        // Update time information
        //
        let now = performance.now();
        let dt = now - previous;
        previous = now;
        //
        Animation.elapsedTime += dt / 1000; // alternative to X3DOM TimeSensors
        Animation.cumulativeElap += dt / 1000;
        
        update(animTargets, dt);
        
        requestAnimationFrame(() => animation_step(previous));
    };
    requestAnimationFrame(() => animation_step(previous));    
}

function update(animTargets, dt) {  

    //
    // (1 / 7) Setting the rocket in the entrance position
    //
    animTargets.rocket.setAttribute('translation', "-3 -3 -5");
    animTargets.rocket.setAttribute('scale', "1 1 1");
    animTargets.rocket.setAttribute('rotation', `0 0 1, ${0.5 * Math.PI}`);    
    
    animTargets.bodyTimeSensor.setAttribute('enabled', "true");
    animTargets.windowTimeSensor.setAttribute('enabled', "true");
    animTargets.noseConeTimeSensor.setAttribute('enabled', "true");
    
    animTargets.earth.setAttribute('render', "false");
    animTargets.venus.setAttribute('render', "false");
    animTargets.jupiter.setAttribute('render', "false");
    animTargets.moon.setAttribute('render', "false");
    
    // Turning OFF the 4 sunlights of the sun
    animTargets.sun.setAttribute('render', "false");
    animTargets.sunlight0.setAttribute('on', "false");
    animTargets.sunlight1.setAttribute('on', "false");
    animTargets.sunlight2.setAttribute('on', "false");
    animTargets.sunlight3.setAttribute('on', "false");

    //
    // (2 / 7) Assembling the rocket
    //
    if (Animation.elapsedTime >= 0 && 
        Animation.elapsedTime <= Animation.spotlightOn) {
        }
    else if (Animation.elapsedTime >= Animation.spotlightOn &&
        Animation.elapsedTime <= Animation.enginesOn) {
            animTargets.spotlight.setAttribute('on', "true");

            animTargets.moonTimeSensor.setAttribute('enabled', "false");
            animTargets.moon.setAttribute('scale', "3 3 3");
            animTargets.moon.setAttribute('render', "true");
            animTargets.moon.setAttribute('translation', "-7 7 0");
    }
    
    //
    // (3 / 7) Engines ON
    //
    else if (Animation.elapsedTime >= Animation.enginesOn &&
             Animation.elapsedTime <= Animation.counterFrom3Starts) {
                animTargets.flamesController.setAttribute('translation', "1.0 0 0");

                animTargets.moonTimeSensor.setAttribute('enabled', "false");
                animTargets.moon.setAttribute('scale', "3 3 3");
                animTargets.moon.setAttribute('render', "true");
                animTargets.moon.setAttribute('translation', "-7 7 0");

    }
    
    //
    // (4 / 7) Countdown from 3
    //
    else if (Animation.elapsedTime >= Animation.counterFrom3Starts &&
             Animation.elapsedTime <= Animation.counterFrom3Ends) {

        animTargets.moonTimeSensor.setAttribute('enabled', "false");
        animTargets.moon.setAttribute('scale', "3 3 3");
        animTargets.moon.setAttribute('render', "true");
        animTargets.moon.setAttribute('translation', "-7 7 0");        


        animTargets.flamesController.setAttribute('translation', "0.8 0 0");

        DecorativeTimer.height += DecorativeTimer.heightStep * dt;
        animTargets.decorativeTimer.setAttribute('translation', `2 ${DecorativeTimer.height} 0`);
        //
        if (Animation.cumulativeElap > 1.52) { // average time of the singer making the countDown
            Animation.cumulativeElap = 0;
            //
            DecorativeTimer.angle += DecorativeTimer.angleStep;
            animTargets.decorativeTimer.setAttribute('rotation', `0 1 0, ${DecorativeTimer.angle}`);
        }
    }
    //
    else if (Animation.elapsedTime >= Animation.counterFrom3Ends &&
        Animation.elapsedTime <= Animation.rocketTakesOff) {
        
        animTargets.moonTimeSensor.setAttribute('enabled', "false");
        animTargets.moon.setAttribute('scale', "3 3 3");
        animTargets.moon.setAttribute('render', "true");
        animTargets.moon.setAttribute('translation', "-7 7 0");

        animTargets.flamesController.setAttribute('translation', "0.5 0 0");

        DecorativeTimer.height += DecorativeTimer.heightStep * dt;
        animTargets.decorativeTimer.setAttribute('translation', `2 ${DecorativeTimer.height} 0`);
    }
        
    //
    // (5 / 7) Rocket TAKES OFF
    //
    else if (Animation.elapsedTime >= Animation.rocketTakesOff &&
        Animation.elapsedTime <= Animation.rocketStartsOrbiting) {

        animTargets.moonTimeSensor.setAttribute('enabled', "false");
        animTargets.moon.setAttribute('scale', "3 3 3");
        animTargets.moon.setAttribute('render', "true");
        animTargets.moon.setAttribute('translation', "-7 7 0");

        DecorativeTimer.height += DecorativeTimer.heightStep * dt;
        animTargets.decorativeTimer.setAttribute('translation', `2 ${DecorativeTimer.height} 0`);
        animTargets.decorativeTimer.setAttribute('render', "false");

        animTargets.flamesController.setAttribute('translation', "-3 0 0");
        animTargets.flamesController.setAttribute('scale', "2 1 1");
        //
        Rocket.takeOffHeight += Rocket.initialHeightStep * dt;
        animTargets.rocket.setAttribute('translation', `-3 ${Rocket.takeOffHeight} -5`);

        animTargets.spotlight.setAttribute('radius', "300");
        animTargets.spotlight.setAttribute('color', `${255 / 255} ${117 / 255} ${1 / 255}`); // light red
        animTargets.spotlight.setAttribute('intesity', "2");

        Viewpoint.angle += Viewpoint.angleStep * dt;
        animTargets.viewpoint.setAttribute('orientation', `1 0 0, ${Viewpoint.angle}`);
    }

    //
    // (6 / 7) Rocket ORBITS (the earth)
    //
    else if (Animation.elapsedTime >= Animation.rocketStartsOrbiting) {

        animTargets.decorativeTimer.setAttribute('render', "false"); 
        animTargets.sun.setAttribute('render', "true");

        animTargets.jupiter.setAttribute('render', "true");
        animTargets.jupiter.setAttribute('translation', "20 0 50");

        animTargets.venus.setAttribute('render', "true");
        animTargets.venus.setAttribute('translation', "0 0 50");
        
        animTargets.spotlight.setAttribute('on', "false");
        animTargets.earth.setAttribute('render', "true");

        animTargets.moonTimeSensor.setAttribute('enabled', "true");
        animTargets.moon.setAttribute('scale', "1 1 1");
        animTargets.moon.setAttribute('render', "true");


        animTargets.flamesController.setAttribute('translation', "-3 0 0")
        animTargets.flamesController.setAttribute('scale', "2 1 1");
        //
        animTargets.rocket.setAttribute('scale', `${Rocket.orbitingSize} ${Rocket.orbitingSize} ${Rocket.orbitingSize}`);

        animTargets.background.setAttribute('skycolor', `${42 / 255} ${54 / 255} ${120 / 255}`); 
        animTargets.rocketRotationTimeSensor.setAttribute('enabled', "true");
        animTargets.rocketOrbitTimeSensor.setAttribute('enabled', "true");

        animTargets.ground.setAttribute('render', "false"); // the alias of "render" ("visible") did not work as expected

        animTargets.starsController.setAttribute('render', "true");

        // Turn on the lights of the sun
        animTargets.sunlight0.setAttribute('on', "true");
        animTargets.sunlight1.setAttribute('on', "true");
        animTargets.sunlight2.setAttribute('on', "true");
        animTargets.sunlight3.setAttribute('on', "true");

        //
        // (7 / 7) Camera moves away from the Earth
        //
        if (Animation.elapsedTime >= Animation.moveAwayFromTheEarth) {
        
            Viewpoint.pos_z += Viewpoint.posStep;
            animTargets.viewpoint.setAttribute('position', `0 0 ${Viewpoint.pos_z}`);
        }
        // Positioned here because the code was almost identical to the phase 6 / 7 (rocket's orbit)
    }
}

function main() {
    let gc = new GraphicalCtx({});
    let model = init_model();

    animate(gc, model);
}

main();
