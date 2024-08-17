export class Ground {
    // In case the developer uses more than one.
    // Allows unique DEFs for the trasnsformations
    static numGrounds = 0; // 

    constructor({width = 10, height = 10, depth = 1, pos_x = 0, pos_y = 0, pos_z = 0, color = "1 0 0"}) {
        this.id = "curtain";
        //
        this.width = 100;
        this.height = 100;
        this.depth = 1;
        //
        this.color = color;

        // Update the counter of grounds to generate uniqueDEFs
        this.id = `ground${Ground.numGrounds}`;
        Ground.numGrounds++;
    }

    getGraph() {
        return {
            tag: 'transform',
            attributes: {
                DEF: `${this.id}`,
                translation: "0 -1.3 -18",
                scale: "1 1 0.3",
                rotation: `1 0 0 ${0.5 * Math.PI}`,
                visible: "false",
            },
            children: [
                {
                    tag: 'shape',
                    children: [

                        {
                            tag: 'appearance',
                            children: [
                                {
                                    tag: 'twosidedmaterial',
                                    attributes: {
                                        diffuseColor: `${this.color}`,

                                    }
                                },
                            ],
                        },

                        {
                            tag: 'box',
                            attributes: {
                                size: `${this.width} ${this.height} ${this.depth}`, 
                            },
                        },
                    ]
                }
            ]
        };
    }
}