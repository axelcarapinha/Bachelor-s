export class DecorativeTimer {
    static angle = 1.5 * Math.PI;
    static angleStep = -0.5 * Math.PI;
    //
    static height = -2.4;
    static heightStep = 0.0020;

    constructor({ size = 0.5, center = { x: 0, y: 0, z: 0 }}) {
        let id = "decorativeTimer";
        this.id = id;
        this.center = center;
        this.size = size;
    }

    getGraphArr({}) {
        return [
            {
                tag: 'transform',
                attributes: {
                    DEF: 'decorativeTimer',
                    translation: `2 ${DecorativeTimer.height} 0`,
                    scale: `${this.size} ${this.size} ${this.size}`,
                },
                children: [
                    {
                        tag: 'shape',
                        children: [
                            {
                                tag: 'appearance',
                                children: [
                                    {
                                        tag: 'ImageTexture',
                                        attributes: {
                                            url: "./assets/images/numbers.jpg",
    
                                        }
                                    },
                                ],
                            },

                            //
                            // Geometry defined by faces
                            //
                            {
                                tag: 'IndexedFaceSet',
                                attributes: {
                                    id: "cube",
                                    coordIndex: `
                                    2 3 7 6 -1
                                    1 2 6 5 -1
                                    0 1 5 4 -1
                                    0 3 2 1 -1
                                    
                                    3 0 4 7 -1
                                    5 6 7 4 -1
                                    `,

                                    texCoordIndex:`
                                    12 13 14 15 -1
                                    8  9  10 11 -1
                                    4  5  6  7  -1
                                    0  1  2  3  -1
                                    
                                    0  1  2  3  -1
                                    0  1  2  3  -1
                                    `,
                                },

                                children: [
                                    {
                                        tag: 'Coordinate',
                                        attributes: {
                                            point: `
                                            -1 -1 -1
                                            -1 -1 +1
                                            +1 -1 +1
                                            +1 -1 -1 
                                            -1 +1 -1 
                                            -1 +1 +1
                                            +1 +1 +1
                                            +1 +1 -1
                                            `,
                                        }
                                    },

                                    // 3 -> 2 -> 1 -> 0 (up to bottom)
                                    {
                                        tag: 'TextureCoordinate',
                                        attributes: {
                                            point: `
                                            0.40 0.50
                                            0.60 0.50
                                            0.60 1.00
                                            0.40 1.00

                                            0.22 0.50
                                            0.40 0.50
                                            0.40 1.00
                                            0.22 1.00

                                            0.03 0.50
                                            0.20 0.50
                                            0.20 1.00
                                            0.03 1.00

                                            0.80 0.00
                                            0.97 0.00
                                            0.97 0.50 
                                            0.80 0.50
                                            `,
                                        }
                                    },
                                ]
                            },
                        ]
                    }
                ]
            },
        ];
    }    
}
