import { Planet } from "./Planet.js";

export class Moon extends Planet { // only for practical reasons!

    constructor({radius = 0.5, center = {x:0, y: 0, z:0}}) {
        let appearance = Moon.#getAppearance();
        let rotPeriod = 27.3; 
        super({planetId: "moon", rotPeriod: rotPeriod, radius:  radius, center: center, appearance: appearance});

        this.rotPeriod = rotPeriod;
        this.id = "moon";
    }

    static #getAppearance() {
        return {
            tag: 'appearance',
            children: [
                {
                    tag: 'commonSurfaceShader',
                    children: [
                        {
                            tag: 'imageTexture',
                            attributes: {
                                containerField: "diffuseTexture",
                                url: "./assets/images/moon_d.jpg",

                            }
                        },
                        // {
                        //     tag: 'imageTexture',
                        //     attributes: {
                        //         containerField: "specularTexture",
                        //         url: "../assets/images/textures/earth_s.jpg",
                        //     }
                        // },
                        {
                            tag: 'imageTexture',
                            attributes: {
                                containerField: "normalTexture",
                                url: "./assets/images/moon_n.png",
                            }
                        }
                    ]
                }
            ]
        };
    }   
}



