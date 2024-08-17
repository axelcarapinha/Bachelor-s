export class Ground extends THREE.Mesh {
    constructor({width = 900 * 10, height = 732 * 10, depth = 0.1, pos_z = 0, image = true}) {
        // Appearance (1  / 2)
        let mat;
        if (image) {
            let loader = new THREE.TextureLoader();
            let diffuseMap = loader.load("assets/textures/clouds_d.jpg");
            let specularMap = loader.load("assets/textures/clouds_s.png");
            let normalMap = loader.load("assets/textures/clouds_n.png");

            diffuseMap.encoding = THREE.sRGBEncoding;
            specularMap.encoding = THREE.sRGBEncoding;
            normalMap.encoding = THREE.sRGBEncoding;

            mat = new THREE.MeshPhongMaterial({
                color: 0xFFFFFFFF, // white
                specular: 0xFFFFFFFF, 
                shininess: 50,
                map: diffuseMap,
                specularMap: specularMap,
                normalMap: normalMap
            });
            if (diffuseMap && diffuseMap.image) {
                width = diffuseMap.image.width;
                diffuseMap.image.height;
            }
        }
        else {
            mat = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF 
            });
        }
        // Geometry ( 2 / 2)
        let geom = new THREE.BoxBufferGeometry(width, height, depth);
        //
        super(geom, mat);


        this.width  = width;
        this.height = height;
        this.depth  = depth;
        this.position.set(0,0,pos_z);
    }
}