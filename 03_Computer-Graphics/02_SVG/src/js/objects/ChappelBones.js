import { CalcsUtils } from "../Utils/Calcs.js";
import { PointsUtils } from "../Utils/Points.js";
export class ChappelBones {
  constructor() {
    this.wallsColor = `hsl(29, 2%, 69%)`;

    // this.smallEntranceW = (1 - 6 * COLUMN_X) / 5;
    this.smallEntranceW = 0.35;

    // Columns
    this.columnsW = 0.05; // 5% of the entrance
    this.columnsH = 0.5;
    this.numColumns = 6;
  }
    
  getGraph({pos_x = 0.2, pos_y = 0.3, size = 0.15}) {
    let graph = {};

    let columns = this.#getColumnsGraph();
    let arches = this.#getArchesGraph();
    let sideTowers = this.#getSideTowers();

    graph = {
      transform: {
        dx: pos_x - 0.09,
        dy: pos_y - 0.15,
        sx: size * 1.2, 
        sy: size * 1, 
        a: 0.5 * Math.PI, 
      },
      style: {
        fill: this.wallsColor,
        stroke: "black",
        lineWidth: 0.001,
      },
      shape: [{x: 0,y: 0}, {x: 2, y: 0}, {x: 2, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}],
      children: [

        this.#getCentralTowerGraph(),
        this.#getFrontalWindowGraph(),
  
        // Entrance structure
        {
          transform: {
            dx: 2,
            dy: -0.96,
            sx: -1,
            sy: 0.46,
            a: 0.5 * Math.PI
          },
          style: {
            fill: "white",
            stroke: "black",
            lineWidth: 0.01,
          },
          shape: [{x: 0,y: 0}, {x: 2, y: 0}, {x: 2, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}],
          children: 
            columns.concat(arches), 
        },
 
        // 2 sideTowers
        ...sideTowers,
         
        // Top
        {
          transform: {
            dx: 0,
            dy: 0,
            sx: 0.2,
            sy: 1,
            a: -0.5 * Math.PI
          },
          style: {
            fill: "white",
            stroke: "black",
            lineWidth: 0.03,
          },
          shape: PointsUtils.triangle_path(),
          children: [
    
          ]
        },
      ]
    };

    return graph;
  }

  #getCentralTowerGraph() {
    return {
      transform: {
        dx: 0,
        dy: 0 - 0.45,
        sx: 0.56,
        sy: 0.1,
        a: -0.5 * Math.PI
      },
      style: {
        fill: "white",
        stroke: "black",
        lineWidth: 0.03,
      },
      shape: PointsUtils.triangle_path(),
      children: [

        // Crucfix's HORIZONTAL part
        {
          transform: {
            dx: 0.5,
            dy: 0 - 1.15,
            sx: 0.40,
            sy: 0.02,
            a: 0 * Math.PI
          },
          style: {
            fill: "white",
            stroke: "grey",
            lineWidth: 0.01,
          },
          shape: PointsUtils.rect_path(),
          children: [

            // Crucfix's VERTICAL part
            {
              transform: {
                dx: 0,
                dy: 1.7,
                sx: 0.15,
                sy: 7,
                a: 0
              },
              style: {
                fill: "white",
                stroke: "grey",
                lineWidth: 0.01,
              },
              shape: PointsUtils.rect_path(),
            },

            // White rectangle (to hide visible interior strokes)
            {
            transform: {
              dx: 0,
              dy: 0.3,
              sx: 0.9,
              sy: 0.85,
              a: 0
            },
            style: {
              fill: "white",
              lineWidth: 0.1,
            },
            shape: PointsUtils.rect_path(),
          },
          ]
        }
      ]
    };
  }

  #getFrontalWindowGraph() {
    return {
      transform: {
        dx: 0.5,
        dy: -0.5,
        sx: 0.23,
        sy: 0.13,
        a: 0.5 * Math.PI
      },
      style: {
        fill: "white",
        stroke: "grey",
        lineWidth: 0.02,
      },
      shape: PointsUtils.rect_path(),
      children: [

        // Window's arch
        {
          transform: {
            // dx: 0 + 2 - (i * (COLUMN_X) + i * (SMALL_ENTRANCE_X / 2)),
            dx: 0 ,
            // dx: 0 + 2 ,
  
            dy: 0.3,
            sx: 1.4,
            sy: 1,
            a: 1 * Math.PI
          },
          style: {
            fill: "white",
            stroke: "grey",
            lineWidth: 0.03,
          },
          shape: PointsUtils.sector_path(30, -(0.5 - 0.25) * Math.PI, -(0.5 + 0.25) * Math.PI)
      
        },

        // White rectangle (to hide visible interior strokes)
        {
          transform: {
            dx: 0,
            dy: 0.94,
            sx: 0.97,
            sy: 0.1,
            a: 0.5 * Math.PI
          },
          style: {
            fill: "white",
            lineWidth: 0.1,
          },
          shape: PointsUtils.rect_path(),
        },
      ] 
    };
  }    

  #getColumnsGraph() {
    let columns = [];

      for (let i = 0; i < this.numColumns; i++) {
        let column = {
          transform: {
            dx: 2 - (i * this.smallEntranceW + i * this.columnsW),
            dy: -0.5,
            sx: this.columnsW,
            sy: this.columnsH,
            a: 0 * Math.PI
          },
          style: {
            fill: "grey",
            stroke: "black",
            lineWidth: 0.03,
          },
          shape: PointsUtils.rect_path()
        };
      columns.push(column);
    }
  
    return columns;
  }
  
  #getArchesGraph() {
    let arches = [];

    for (let i = 1; i < 6; i++) {
      let arch = {
        transform: {
          dx: 0 + 1.98 + (this.columnsW + (this.smallEntranceW / 2)) - ((i * this.columnsW) + (i * this.smallEntranceW)) ,            
          dy: -0.4,
          sx: 0.15,
          sy: 0.15,
          a: 1 * Math.PI
        },
        style: {
          fill: "white",
          stroke: "black",
          lineWidth: 0.08,
        },
        shape: PointsUtils.sector_path(30, -0.1 * Math.PI, 1.1 * Math.PI),
      };

      arches.push(arch);
    }

    return arches;
  }
  
  #getSideTowers() {
    let sideTowers = [];

    for (let i = 0; i < 2; i++) {
      let tower = {
        transform: {
          dx: 0,
          dy: 0 - (0.9 * i),
          sx: 0.4,
          sy: 0.1,
          a: -0.5 * Math.PI
        },
        style: {
          fill: "white",
          stroke: "black",
          lineWidth: 0.03,
        },
        shape: PointsUtils.triangle_path(),
      };

      sideTowers.push(tower);
    }

    return sideTowers;
  }
}    




