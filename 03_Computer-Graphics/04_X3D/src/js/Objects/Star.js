import { CalcsUtils } from "../utils/Calcs.js";
import { Planet } from "./Planet.js";

export class Star extends Planet { // just for practical reasons!
    static numStars = 0;

    constructor({id = `star${Star.numStars}`,radius = 1, center = {x:0, y: 0, z:0}, hasLight = false}) {
        Star.numStars++;

        let appearance = Star.#getAppearance();
        let rotPeriod = 24 * CalcsUtils.rand_ab(25,35); // 25 - 35 earth days (differential rotation)
        super({thisId: id, rotPeriod: rotPeriod, radius:  radius, center: center, appearance: appearance, hasLight: hasLight});
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
                                // url: "../assets/images/textures/earth_d.jpg",
                                url: "./assets/images/sun_d.jpg",

                            }
                        },
                        // {
                        //     tag: 'imageTexture',
                        //     attributes: {
                        //         containerField: "specularTexture",
                        //         url: "../assets/images/textures/earth_s.jpg",
                        //     }
                        // },
                        // {
                        //     tag: 'imageTexture',
                        //     attributes: {
                        //         containerField: "normalTexture",
                        //         url: "../assets/images/textures/earth_n.png",
                        //     }
                        // }
                    ]
                }
            ]
        };
    }
}






