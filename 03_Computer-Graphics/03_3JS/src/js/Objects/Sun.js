export class Sun extends THREE.Mesh {
    constructor({pos_x = 0, pos_y = 0, pos_z = 0}) {
        let sphereGeo = new THREE.SphereBufferGeometry(
            5,  // radius
            32, // widhSegments
            32, // heightSegments
        );
        sphereGeo.computeBoundingSphere(); // help the rendering system know when is visible and when not (with the fog effect, for example)
        //
        let material = new THREE.MeshPhongMaterial({ // reflecting mesh
            color: "yellow",
            shininess: 100,
            reflectivity: 1,
            specular: 0xFFFFFF,
            emissive: 0XFFFF00,
            // transparent: true,
            // opacity: 0.8,
        });
        material.side = THREE.DoubleSide;
        
        super(sphereGeo, material);

        this.position.set(pos_x, pos_y, pos_z);

        this.angleOrbit = 0.1 * Math.PI;
        this.radiusOrbit = 800;
        this.angleStep = 0.00001;

        //
        // Light
        //
        let sun_light = new THREE.PointLight(0xFFFFFF, 1.5,0);
        sun_light.position.set(this.position.x, this.position.y, this.position.z);
       
        this.add(sun_light);       
    }


    update(dt) {
        //
        // Orbit around the point (0,0,0)
        //
        this.angleOrbit += this.angleStep * dt;
    
        
        this.position.set( // Polar coordinates
            Math.cos(this.angleOrbit) * (-300) ,
            Math.cos(this.angleOrbit) * this.radiusOrbit,
            Math.sin(this.angleOrbit) * this.radiusOrbit - 300 // give illusion of hight altitude of the ground
        );
    }
}
