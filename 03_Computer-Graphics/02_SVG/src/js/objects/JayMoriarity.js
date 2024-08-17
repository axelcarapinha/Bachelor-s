import { PointsUtils } from "../Utils/Points.js";

export class JayMoriarity {
  #NUM_POINTS_CURVES;

  constructor({NUM_POINTS_CURVES = 50}) {  
    this.#NUM_POINTS_CURVES = NUM_POINTS_CURVES;
  }

  getGraph({pos_x = 0.2, pos_y = 0.3, sx = 0.12, sy = 0.12}) {
    const JAY_SKIN_COLOR = `hsl(11, 65%, 78%)`;
    const JAY_HAIR_COLOR = `hsl(37, 25%, 34%)`;

    let eyes = this.#getEyesGraphs();
    let eyebrows = this.#getEyebrowsGraphs();

    return {
      // Shirt (chest part)
      transform: {
        dx: pos_x - 0.25,
        dy: pos_y - 0.3,
        sx: sx, 
        sy: sy,
        a: 0 * Math.PI,
      },
      style: {
        fill: "steelblue",
        stroke: "black",
        lineWidth: 0.03,
      },
      shape: [
        {x: 2.16, y: 2.41}, 
        {x: 2.85, y: 2.19},
        {x: 2.04, y: 1.28},
        {x: 1.92, y: 1.29},
        {x: 1.73, y: 1.38},
        {x: 1.71, y: 1.48},
        {x: 2.15, y: 2.40}],
      children: [

        this.#getBoardGraph(),

        // Hair
        {
          transform: {
            dx: 1.5, 
            dy: 0.8,
            sx: 0.4, 
            sy: 0.5,
            a: -0.1 * Math.PI,
          },
          style: {
            fill: JAY_HAIR_COLOR,
            stroke: "black",
            lineWidth: 0.05,
          },
          shape: PointsUtils.circle_path(),
          children: [
            
  
          {
            // NECK, FACE, ...
            transform: {
              dx: -3.7,
              dy: -3.5,
              sx: 2.9, 
              sy: 2.9,
              a: 0.07 * Math.PI,
            },
            style: {
              fill: JAY_SKIN_COLOR,
              stroke: "black",
              lineWidth: 0.03,
            },
            shape: [
              // Beggining of the NECK
              {x: 1.95, y: 1.26}, 
              {x: 1.94, y: 1.25},
              {x: 1.91, y: 1.22},
              {x: 1.87, y: 1.17},
              {x: 1.85, y: 1.14},
              {x: 1.84, y: 1.09},
  
              // HEAD
              {x: 1.84, y: 1.04},
              {x: 1.85, y: 0.99},
              {x: 1.84, y: 0.95},
              {x: 1.83, y: 0.92},
              {x: 1.80, y: 0.90},
              {x: 1.77, y: 0.88},
              {x: 1.73, y: 0.86},
              {x: 1.68, y: 1.08},
              {x: 1.67, y: 1.08},
              {x: 1.64, y: 1.06},
              {x: 1.62, y: 1.04},
              {x: 1.60, y: 1.02},
              {x: 1.60, y: 0.99},
              {x: 1.58, y: 0.93},
              {x: 1.57, y: 0.89},
              {x: 1.55, y: 0.86},
              {x: 1.53, y: 0.84},
              {x: 1.50, y: 0.82},
              {x: 1.56, y: 0.81},
              {x: 1.52, y: 0.79},
              {x: 1.47, y: 0.78},
              {x: 1.41, y: 0.77},

              {x: 1.15, y: 0.76},
              {x: 1.20, y: 0.75},
              {x: 1.14, y: 0.75},
  
              // Forehead
              {x: 1.14, y: 0.78}, 
              {x: 1.15, y: 0.85},
              {x: 1.19, y: 0.93},
              {x: 1.18, y: 0.98},
              {x: 1.10, y: 1.10},
  
              //
              {x: 1.10, y: 1.11},
              {x: 1.20, y: 1.16},
              {x: 1.24, y: 1.28},
  
              //
              {x: 1.27, y: 1.32},
              {x: 1.32, y: 1.36},
              {x: 1.39, y: 1.38},
              {x: 1.46, y: 1.38},
              {x: 1.61, y: 1.37},
              {x: 1.64, y: 1.39},
              {x: 1.70, y: 1.46},
              {x: 1.72, y: 1.39},
              {x: 1.75, y: 1.36},
              {x: 1.83, y: 1.30},
              {x: 1.91, y: 1.26},
              {x: 1.95, y: 1.26},
            ],
            children: [
              
              {
                // Mouth
                transform: {
                  dx: 1.22,
                  dy: 1.05,
                  sx: 0.2, 
                  sy: 0.2,
                  a: 0.4 * Math.PI,
                },
                style: {
                  fill: "black",
                  stroke: "black",
                  lineWidth: 0.2,
                },
                shape: PointsUtils.sector_path(50, -0.20 * Math.PI, 0.1 * Math.PI, true),
                children: [
                  
                ]
              },
  
              // Eyebrows
              ...eyebrows,

              // [rightEye, leftEye]
              ...eyes,
  
            ]
          },
      
        ]
          },
    
  
          // Shirt (LEFT shoulder)
          {
            transform: {
              dx: 0,
              dy: 0,
              sx: 1, 
              sy: 1,
              a: 0 * Math.PI,
            },
            style: {
              fill: "steelblue",
              stroke: "black",
              lineWidth: 0.03,
            },
            shape: [
              {x: 2.51, y: 1.28}, 
              {x: 2.49, y: 1.71},
              {x: 2.07, y: 1.71},
              {x: 1.90, y: 1.49},
              {x: 2.07, y: 1.28},
              {x: 2.51, y: 1.28}],
            children: [
              
              {
    
                // LEFT arm and LEFT hand
                transform: {
                  dx: 0,
                  dy: 0,
                  sx: 1, 
                  sy: 1,
                  a: 0 * Math.PI,
                },
                style: {
                  fill: JAY_SKIN_COLOR,
                  stroke: "black",
                  lineWidth: 0.03,
                },
                shape: [
                  // Beggining of the ARM
                  {x: 2.52, y: 1.38}, 
                  {x: 2.85, y: 1.38},
    
                  // Beggining of the FOREARM
                  {x: 3.30, y: 1.68},
                  {x: 3.35, y: 1.66},
    
                  // HAND
                  {x: 3.39, y: 1.69},
                  {x: 3.50, y: 1.75},
                  {x: 3.72, y: 1.76},
                  {x: 3.74, y: 1.80},
                  {x: 3.69, y: 1.82},
                  {x: 3.58, y: 1.81},
                  {x: 3.73, y: 1.86},
                  {x: 3.76, y: 1.90},
                  {x: 3.67, y: 1.93},
                  {x: 3.52, y: 1.88},
                  {x: 3.69, y: 1.97},
                  {x: 3.71, y: 2.02},
                  {x: 3.65, y: 2.03},
                  {x: 3.52, y: 1.96},
                  {x: 3.60, y: 2.06},
                  {x: 3.59, y: 2.12},
                  {x: 3.54, y: 2.11},
                  {x: 3.35, y: 1.94},
                  {x: 3.35, y: 2.05},
                  {x: 3.31, y: 2.12},
                  {x: 3.26, y: 2.10},
                  {x: 3.21, y: 1.95},
                  
                  // End of the FOREARM
                  {x: 3.17, y: 1.89},
                  {x: 3.15, y: 1.83},
                  
                  // End of the ARM
                  {x: 2.79, y: 1.64},
                  {x: 2.53, y: 1.62},
                  {x: 2.52, y: 1.38},
                ],
                children: [
                  
                ]
              },
    
    
    
            ]
          },
    
    
          // Shirt (RIGHT shoulder)
          {
            transform: {
              dx: 0,
              dy: 0,
              sx: 1, 
              sy: 1,
              a: 0 * Math.PI,
            },
            style: {
              fill: "steelblue",
              stroke: "black",
              lineWidth: 0.03,
            },
            shape: [
              {x: 1.97, y: 2.04}, 
              {x: 1.94, y: 2.09},
              {x: 1.53, y: 1.96},
              {x: 1.65, y: 1.54},
              {x: 1.70, y: 1.50},
              {x: 1.97, y: 2.04}],
            children: [
              
              // RIGHT arm and RIGHT hand
              {
                transform: {
                  dx: 0,
                  dy: 0,
                  sx: 1, 
                  sy: 1,
                  a: 0 * Math.PI,
                },
                style: {
                  fill: JAY_SKIN_COLOR,
                  stroke: "black",
                  lineWidth: 0.03,
                },
                shape: [
                  // Beggining of the ARM
                  {x: 1.84, y: 2.09}, 
                  {x: 1.79, y: 2.32},
                  {x: 1.75, y: 2.36},
                  
                  // Beggining of the FOREARM
                  {x: 1.71, y: 2.36},
                  {x: 1.25, y: 2.46},
    
                  // HAND
                  {x: 1.19, y: 2.52},
                  {x: 1.08, y: 2.55},
                  {x: 0.99, y: 2.55},
                  {x: 0.95, y: 2.53},
                  {x: 0.94, y: 2.48},
    
                  {x: 1.07, y: 2.42},
                  {x: 1.07, y: 2.40},
                  {x: 1.03, y: 2.36},
                  {x: 0.72, y: 2.30},
                  {x: 0.70, y: 2.24},
                  {x: 0.75, y: 2.23},
                  {x: 0.95, y: 2.25},
    
                  // End of the FOREARM
                  {x: 1.12, y: 2.26},
                  {x: 1.22, y: 2.24},
                  
                  // End of the ARM
                  {x: 1.55, y: 2.14},
                  {x: 1.60, y: 2.00},
                  {x: 1.84, y: 2.09},
                ],
                children: [
                  
                ]
              },
            ]
          },
    
    
          // Shorts (LEFT Leg)
          {
            transform: {
              dx: 0,
              dy: 0,
              sx: 1, 
              sy: 1,
              a: 0 * Math.PI,
            },
            style: {
              fill: "orange",
              stroke: "black",
              lineWidth: 0.03,
            },
            shape: [
              {x: 1.89, y: 2.81}, 
              {x: 2.26, y: 3.12},
              {x: 2.84, y: 2.55},
              {x: 2.90, y: 2.34},
              {x: 2.85, y: 2.20},
              {x: 2.18, y: 2.40},
              {x: 1.88, y: 2.82}],
            children: [
              {
    
                // LEFT Leg
                transform: {
                  dx: 0,
                  dy: 0,
                  sx: 1, 
                  sy: 1,
                  a: 0 * Math.PI,
                },
                style: {
                  fill: JAY_SKIN_COLOR,
                  stroke: "black",
                  lineWidth: 0.03,
                },
                shape: 
                [
                  {x: 1.89, y: 2.81}, 
                  {x: 1.72, y: 3.06},
                  {x: 1.65, y: 3.17},
                  {x: 1.67, y: 3.30},
                  {x: 1.92, y: 4.26},
                  {x: 1.67, y: 4.27},
                  {x: 1.58, y: 4.41},
                  {x: 1.66, y: 4.50},
                  {x: 2.18, y: 4.53},
                  {x: 2.25, y: 4.47},
                  {x: 2.04, y: 3.33},
                  {x: 2.25, y: 3.13},
                  {x: 1.89, y: 2.81}, 
                ],
              },
            ]
          },
    
          // Shorts (RIGHT Leg)
          {
            transform: {
              dx: 0,
              dy: 0,
              sx: 1, 
              sy: 1,
              a: 0 * Math.PI,
            },
            style: {
              fill: "orange",
              stroke: "black",
              lineWidth: 0.03,
            },
            shape: [
              {x: 2.45, y: 2.94}, 
              {x: 2.64, y: 3.01},
              {x: 2.82, y: 2.58},
              {x: 2.45, y: 2.94}],
            children: [
              
    
              // RIGHT Leg
              {
                transform: {
                  dx: 0,
                  dy: 0,
                  sx: 1, 
                  sy: 1,
                  a: 0 * Math.PI,
                },
                style: {
                  fill: JAY_SKIN_COLOR,
                  stroke: "black",
                  lineWidth: 0.03,
                },
                shape: 
                [
                  {x: 2.45, y: 2.96}, 
                  {x: 2.27, y: 3.13},
                  {x: 2.22, y: 3.24},
                  {x: 2.28, y: 3.31},
    
                  // RIGHT Foot
                  {x: 2.70, y: 3.59},
    
                  // {x: 2.59, y: 3.12},
                  // {x: 2.63, y: 3.02},
                  // {x: 2.67, y: 3.60},
                  // {x: 2.65, y: 3.63},
                  // {x: 2.63, y: 3.68},
                  // {x: 2.63, y: 3.72},
                  // {x: 2.66, y: 3.77},
                  // {x: 2.71, y: 3.78},
                  
                  {x: 2.61, y: 3.71},
                  
    
                  {x: 2.69, y: 3.78},
                  {x: 3.09, y: 3.77},
                  {x: 3.15, y: 3.71},
                  {x: 3.11, y: 3.59},
    
                  {x: 2.59, y: 3.12},
                  {x: 2.63, y: 3.02},
                  {x: 2.45, y: 2.96},
                ],
                children: [
                  
                ]
              },
    
    
    
            ]
          },
      ]
    };
  }

  #getEyesGraphs() {
    let eyes = [];

    for (let i = 0; i < 2; i++) {
        let eye = {

        // EYE'S sclera
        transform: {
          dx: 1.15 + i * 0.2,
          dy: 0.94, 
          sx: 0.08, // 0.009
          sy: 0.08, // 0.012
          a: -0.5 * Math.PI,
        },
        style: {
          fill: "white",
          stroke: "grey",
          lineWidth: 0.1,
        },
        shape: PointsUtils.circle_path(),
        children: [
          
          // EYE'S iris
          {
            transform: {
                dx: -0.1, 
                dy: -0.3, 
                sx: 0.6, 
                sy: 0.6,
                a: -0.5 * Math.PI,
            },
            style: {
                fill: "steelblue",
                lineWidth: 0.05,
            },
            shape: PointsUtils.circle_path(),
            children: [

              // EYE'S pupil
              {
                transform: {
                  dx: 0, 
                  dy: 0, 
                  sx: 0.6, 
                  sy: 0.6, 
                  a: -0.5 * Math.PI,
                },
                style: {
                  fill: "black",
                  stroke: "black",
                  lineWidth: 0.05,
                },
                shape: PointsUtils.circle_path(),
              },
            ]
          },
    
    
        ]
        };

        eyes.push(eye);
    }

    return eyes;
  };
      
  #getEyebrowsGraphs() {
    let eyebrows = [];
  
    for (let i = 0; i < 2; i++) {
      let eyebrow = {
        // Eyebrow
        transform: {
          dx: 1.17 + i * 0.19,
          dy: 1.14,
          sx: 0.18, 
          sy: 0.34,
          a: 0 * Math.PI,
        },
        style: {
          stroke: "black",
          lineWidth: 0.1,
        },
        shape: PointsUtils.sector_path(50, -(0.5 - 0.1)  * Math.PI, -(0.5 + 0.1) * Math.PI, true),
        children: [
        
        ]
      };

      eyebrows.push(eyebrow);
    }

    return eyebrows;
  }

  #getBoardGraph() {  

    //
    // Jay Moriarity's classic board
    //
    return {
      transform: {
        dx: 2,
        dy: 4,
        sx: 0.1 * 20,
        sy: 0.015 * 20,
        a: 1.5 * Math.PI,
      },
      style: {
        fill: "url(#boardGradient)",  
        lineWidth: 0.01,
      },
      linearGradient: {
        id: "boardGradient", // defining the board Gradient
        x1: "0",
        x2: "0",
        y1: "0",
        y2: "1",
        stops: [
          { offset: "0%", color: "hsl(59, 100%, 64%)" },
          { offset: "30%", color: "hsl(46, 100%, 50%)" },
          { offset: "50%", color: "hsl(4, 92%, 52%)" },
          { offset: "70%", color: "white" },
          { offset: "100%", color: "hsl(127, 46%, 44%)" },
        ],
      },
      shape: PointsUtils.rotatePoints(PointsUtils.circle_path(), -0.5 * Math.PI, { x: 0, y: 0 }),
      children: [
        // White triangle on the board
        {
          transform: {
            dx: -0.7,
            dy: 0.7,
            sx: 1.32,
            sy: 0.2,
            a: 0 * Math.PI,
          },
          style: {
            fill: "white",  
            stroke: "grey",
            lineWidth: 0.01,
          },
          shape: PointsUtils.triangle_path(),
        },
      ],
    };
  }
  

}


    




