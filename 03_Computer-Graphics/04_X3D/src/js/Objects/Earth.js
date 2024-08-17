import { Planet } from "./Planet.js";

export class Earth extends Planet {
    constructor({radius = 0.5, center = {x:0, y: 0, z:0}}) {
        let appearance = Earth.#getAppearance();
        let rotPeriod = 24;
        let id = "earth";
        super({planetId: id, rotPeriod: rotPeriod, radius:  radius, center: center, appearance: appearance});
        
        this.id = id;
        this.center = center;
        this.rotPeriod = 24;
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
                                url: "./assets/images/earth_d.jpg",
                            }
                        },
                        {
                            tag: 'imageTexture',
                            attributes: {
                                containerField: "specularTexture",
                                url: "./assets/images/earth_s.png",
                            }
                        },
                        {
                            tag: 'imageTexture',
                            attributes: {
                                containerField: "normalTexture",
                                url: "./assets/images/earth_n.png",
                            }
                        }
                    ]
                }
            ]
        };
    }
}




