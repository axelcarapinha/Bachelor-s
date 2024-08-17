import { Planet } from "./Planet.js";

export class Venus extends Planet {
    constructor({radius = 0.5, center = {x:0, y: 0, z:0}}) {
        let appearance = Venus.#getAppearance();
        let rotPeriod = 243 * 24; // 243 days
        let id = "venus";
        super({planetId: id, rotPeriod: rotPeriod, radius:  radius, center: center, appearance: appearance});
        
        this.id = id;
        this.center = center;
        this.rotPeriod = rotPeriod;
        this.radius = radius;
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
                                url: "./assets/images/venus_d.jpg",

                            }
                        },
                        {
                            tag: 'imageTexture',
                            attributes: {
                                containerField: "specularTexture",
                                url: "./assets/images/venus_s.png",
                            }
                        },
                        {
                            tag: 'imageTexture',
                            attributes: {
                                containerField: "normalTexture",
                                url: "./assets/images/venus_n.png",
                            }
                        }
                    ]
                }
            ]
        };
    }
}


