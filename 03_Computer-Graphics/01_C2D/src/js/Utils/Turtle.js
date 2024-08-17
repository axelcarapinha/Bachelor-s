import { CalcsUtils } from "./Calcs.js";

//
// ** Creates paths according to Lindenmayer systems ** // 
//
export class Turtle {
    constructor() {
        this.x = 0.0;
        this.y = 0.0;
        this.heading = 0.0;
        this.points = [{
            x: 0.0,
            y: 0.0,
        }];
        this.min_x = 0.0;
        this.max_x = 0.0;
        this.min_y = 0.0;
        this.max_y = 0.0;
    }
    
    // #init_turtle() {
    //     return {
    //         x: 0.0,
    //         y: 0.0,
    //         heading: 0.0,
    //         points: [{
    //             x: 0.0,
    //             y: 0.0,
    //         }],
    //         min_x: 0.0,
    //         max_x: 0.0,
    //         min_y: 0.0,
    //         max_y: 0.0,
    //     }
    // }
    
    #turn(t, angle) {
        t.heading += angle;
    }
    
    #turn_to(t, angle) {
        t.heading = angle;
    }
    
    #right(t, angle) {
        this.#turn(t, angle);
    }
    
    #left(t, angle) {
        this.#turn(t, -angle);
    }
    
    #move(t, d) {
        let moved = false;
        if (d.x) {
            t.x += d.x;
            t.max_x = Math.max(t.max_x, t.x);
            t.min_x = Math.min(t.min_x, t.x);
            moved = true;
        }
        if (d.y) {
            t.y += d.y;
            t.max_y = Math.max(t.max_y, t.y);
            t.min_y = Math.min(t.min_y, t.y);
            moved = true;
        }
        if (moved) {
            t.points.push({
                x: t.x,
                y: t.y
            });
        }
    }
    
    #move_to(t, p) {
        let dx = 0.0,
            dy = 0.0;
        if (p.x) dx = p.x - t.x;
        if (p.y) dy = p.y - t.y;
        this.#move(t, {
            x: dx,
            y: dy
        });
    }
    
    #forward(t, d) {
        let dx = d * Math.cos(t.heading);
        let dy = d * Math.sin(t.heading);
    
        this.#move(t, {
            x: dx,
            y: dy
        });
    }
    
    #backward(t, d) {
        this.#forward(t, -d);
    }
    
    #ls_step(ls, word) {
        let next_word = [];
        for (let symbol of word) {
            if (ls.rules[symbol]) {
                next_word = next_word.concat(ls.rules[symbol]);
            } else {
                next_word.push(symbol);
            }
        }
        return next_word;
    }
    
    #ls_iter(ls, n) {
        let word = ls.start;
        for (let i = 0; i < n; i++) {
            word = this.#ls_step(ls, word);
        }
        return word;
    }
    
    ls_turtle(ls, n, turtle) {
        let word = this.#ls_iter(ls, n);
        // let turtle = this.#init_turtle();
    
        //! Acrescentado
        let coord = [];
    
        for (let symbol of word) {
            if (ls.semantics[symbol]) {
    
                //! Acrescentado
                let before = {x: turtle.x, y: turtle.y};
    
                ls.semantics[symbol](turtle);
    
                //! Acrescentado
                coord.push({ x: before.x, y: before.y }); // Store the previous position
                coord.push({ x: turtle.x, y: turtle.y }); // Store the current position
            }
        }
    
        //! Acrescentado e comentado
        return turtle;
    }
    
 
    
    koch_curve() {
        let base_angle = CalcsUtils.degreesToRadians(90);
        return {
            start: 'F'.split(''),
            rules: {
                'F': 'FpFmFmFpF'.split(''),

            },
            semantics: {
                'F': (t) => this.#forward(t, 1.0),
                'p': (t) => this.#left(t, base_angle),
                'm': (t) => this.#right(t, base_angle),
            }
        };
    }
    
    sierpinski_triangle() {
        let base_angle = CalcsUtils.degreesToRadians(-120);
        return {
            start: 'FmGmG'.split(''),
            rules: {
                'F': 'FmGpFpGmF'.split(''),
                'G': 'GG'.split('')
            },
            semantics: {
                'F': (t) => this.#forward(t, 1.0),
                'G': (t) => this.#forward(t, 1.0),
                'p': (t) => this.#left(t, base_angle),
                'm': (t) => this.#right(t, base_angle),
            }
        };
    }
    
    
    sierpinski_arrowhead() {
        let base_angle = CalcsUtils.degreesToRadians(60);
        return {
            start: 'A'.split(''),
            rules: {
                'A': 'BmAmB'.split(''),
                'B': 'ApBpA'.split('')
            },
            semantics: {
                'A': (t) => this.#forward(t, 1.0),
                'B': (t) => this.#forward(t, 1.0),
                'p': (t) => this.#left(t, base_angle),
                'm': (t) => this.#right(t, base_angle),
            }
        };
    }
    
    dragon_curve() {
        let base_angle = CalcsUtils.degreesToRadians(90);
        return {
            start: 'FX'.split(''),
            rules: {
                'X': 'XpYFp'.split(''),
                'Y': 'mFXmY'.split('')
            },
            semantics: {
                'F': (t) => this.#forward(t, 1.0),
                'G': (t) => this.#forward(t, 1.0),
                'p': (t) => this.#right(t, base_angle),
                'm': (t) => this.#left(t, base_angle),
                'X': (t) => this.#forward(t, 0.0),
                'Y': (t) => this.#forward(t, 0.0),
            }
        };
    }

    //! Acrescentado
    axel_path() {
        let base_angle = CalcsUtils.degreesToRadians(60);
        return {
            start: 'A'.split(''),
            rules: {
                'A': 'AxElAxElAxEl'.split(''),
                'E': 'ElAlAlAlA'.split('')

            },
            semantics: {
                'A': (t) => this.#forward(t, 1.0),
                'x': (t) => this.#left(t, base_angle),
                'E': (t) => this.#forward(t, 1.0),
                'l': (t) => this.#right(t, base_angle),
            }
        };
    }
    
    static linear_cv(x, a, b, c, d) {
        return c + (d - c) * (a - x) / (a - b);
    }
}