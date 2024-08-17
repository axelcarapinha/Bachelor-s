import { Animation } from "../Rendering/Animation.js";

export class Planet {
    static earthRadius = 0.5;

    constructor({thisId = "planet", rotPeriod = 24, radius = 0.5, center = {x:0, y: 0, z:0}, appearance = null, hasLight = false}) {
        // Targetting the animation
        this.id = thisId;

        this.radius = radius;
        this.center = center;
        //
        this.rotPeriod = rotPeriod;
        //
        this.orbitCenter = null;
        this.orbitRadius = null;
        this.orbitPeriod = 27.4; 

        // Appearance 
        this.appearance = (appearance != null) ? appearance : this.#getBasicAppearance();
        //
        this.lights = (hasLight) ? this.getLightsArr(thisId) : [];
    }

    getGraph() {
        return {
            tag: 'transform',
            attributes: {
                DEF: this.id,
                translation: `${this.center.x} ${this.center.y} ${this.center.z}`,
            },
            children: [
                {
                    tag: 'transform',
                    attributes: {
                        DEF: "planet",
                    },
                    children: [
                        
                        {
                            tag: 'shape',
                            children: [
                                
                                this.appearance,
                                
                                {
                                    tag: 'sphere',
                                    attributes: {
                                        radius: this.radius,
                                    }
                                }
                            ],
                        },

                        ...this.lights,
                    ],
                },
            ]
        };
    }

    getAnimationArr({hasAxialRotAnim = true, hasOrbitAnim = false, orbitCenter = null, orbitRadius_x = 1, orbitRadius_y = 1}) { 
        let animationArr = [];
        let auxiliaryArr  = [];

        //
        // Axial Rotation
        //
        if (hasAxialRotAnim) {
            auxiliaryArr = Animation.getAxialRotArr({id: this.id, rotPeriod: this.rotPeriod});
            animationArr = [...animationArr, ...auxiliaryArr];
        }
        
        //
        // Orbit
        //      
        if (hasOrbitAnim) {
            auxiliaryArr = Animation.getOrbitArr({id: this.id, orbitCenter: orbitCenter, orbitPeriod: this.orbitPeriod, orbitRadius_x: orbitRadius_x, orbitRadius_y: orbitRadius_y});
            animationArr = [...animationArr, ...auxiliaryArr];
        }

        return animationArr;
    }

    #getBasicAppearance() {
        return {
            tag: 'appearance',
            children: [
                {
                    tag: 'material',
                    attributes: {
                        diffuseColor: "yellow",
                        specularColor: "white",
                        shininess: "100", 
                        emissiveColor: "white",

                    }
                }
            ]
        };
    }

    // For the sun and stars
    getLightsArr(id) {
        let lights = [];

        // 4 lights to iluminate all the angles of the sphere
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            let offset_x = Math.cos(angle) * (this.radius + 35); 
            let offset_z = Math.sin(angle) * (this.radius + 35);

            let light = {
                tag: 'pointLight',
                attributes: {
                    DEF: `${id}Pointlight${i}` ,
                    radius: `${this.radius * 800}`,
                    intensity: "2.5",
                    location: `${this.center.x + offset_x} ${this.center.y} ${this.center.z + offset_z}`,
                    color: `${255 / 255}, ${216 / 255}, ${92 / 255}`, // yellowish color
                }
            };

            lights.push(light);
        }
        

        return lights;
    }

}