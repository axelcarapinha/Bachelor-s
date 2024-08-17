export class Mountain extends THREE.Mesh {
    constructor({size = 1}) {
        // Geometry
        let geom = Mountain.#getGeometry();

        // Appearance
        let loader = new THREE.TextureLoader();
        let diffuseMap = loader.load("assets/textures/mountain_d.jpg");
        let specularMap = loader.load("assets/textures/mountain_s.png");
        let normalMap = loader.load("assets/textures/mountain_n.png");
        let mat = new THREE.MeshPhongMaterial({
            specular: 0xFFFFFF,
            shininess: 1,
            map: diffuseMap,
            specularMap: specularMap,
            normalMap: normalMap
        });

        //
        //  Object = Geometry + Appearance
        //
        super(geom, mat);
        //
        this.size = size;
    }
    
    static #getGeometry() {  
        let geom = new THREE.Geometry();

        //
        //  Coordinates
        //
        let coordinates = [
            new THREE.Vector3(0.0,0.0,0.0), 
            new THREE.Vector3(1.0,0.0,0.0),
            new THREE.Vector3(0.5,1.0,0.0),
            new THREE.Vector3(0.5,0.5,1.0), // top
        ];

        //
        //  Faces (triangles!)
        //
        let faces = [
            new THREE.Face3(0,2,1), // base
            new THREE.Face3(1,3,0), // front
            new THREE.Face3(2,3,1), // right part
            new THREE.Face3(0,3,2), // 
        ];

        //
        //  Geometry
        //
        const IMAGE_SIZE = 400;
        let uv_coordinates = [
            new THREE.Vector2(75 / IMAGE_SIZE,  1 - (357 / IMAGE_SIZE)),
            new THREE.Vector2(202 / IMAGE_SIZE, 1 - (115 / IMAGE_SIZE)),
            new THREE.Vector2(339 / IMAGE_SIZE, 1 - (358 / IMAGE_SIZE)),
        ];
        
        let uv_map = new Array(faces.length);
        for (let i = 0; i < faces.length; i++) {
            uv_map[i] = uv_coordinates;
        }
        
        geom.vertices = coordinates;
        geom.faces = faces;
        //
        geom.faceVertexUvs[0] = uv_map;
        geom.uvsNeedUpdate = true;
        
        geom.computeFaceNormals(); 
        geom.computeBoundingSphere(); 

        return geom;
    }
}    

    
    
    
    




