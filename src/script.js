import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

let canvas;
let camera;
let renderer;
let scene;
let controls;
let groundParams;
let wallsParams;
let roofParams;
let doorParams;
let graveParams;
const house = new THREE.Group();
const bushes = new THREE.Group();
const textureLoader = new THREE.TextureLoader();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const radians = {
    eighth: Math.PI * 0.25,
    quarter: Math.PI / 2,
    half: Math.PI,
    full: Math.PI * 2
};

function createScene() {
    scene = new THREE.Scene();

    const fov = 75;
    const aspect = sizes.width / sizes.height;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
    camera.position.set(4, 2, 5);

    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(camera);
    renderer.render(scene, camera);
}

function handleGroundTexture() {
    // Load Textures
    

    return {
        floorAlphaTexture,
        floorColorTexture,
        floorAlphaTexture,
        floorARMTexture,
        floorNormalTexture,
        floorDisplacementTexture
    }
}
function createGround() {
    groundParams = {
        width: 20,
        height: 20,
        widthSegments: 100,
        heightSegments: 100
    };

    const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
    const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg');
    const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg');
    const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg');
    const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg');

    floorColorTexture.repeat.set(8, 8);
    floorARMTexture.repeat.set(8, 8);
    floorNormalTexture.repeat.set(8, 8);
    floorDisplacementTexture.repeat.set(8, 8);

    floorColorTexture.colorSpace = THREE.SRGBColorSpace;

    floorColorTexture.wrapS = THREE.RepeatWrapping;
    floorARMTexture.wrapS = THREE.RepeatWrapping;
    floorNormalTexture.wrapS = THREE.RepeatWrapping;
    floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

    floorColorTexture.wrapT = THREE.RepeatWrapping;
    floorARMTexture.wrapT = THREE.RepeatWrapping;
    floorNormalTexture.wrapT = THREE.RepeatWrapping;
    floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(
            groundParams.width,
            groundParams.height,
            groundParams.widthSegments,
            groundParams.heightSegments
        ),
        new THREE.MeshStandardMaterial({
            alphaMap: floorAlphaTexture,
            transparent: true,
            map: floorColorTexture,
            aoMap: floorARMTexture,
            roughnessMap: floorARMTexture,
            metalnessMap: floorARMTexture,
            normalMap: floorNormalTexture,
            displacementMap: floorDisplacementTexture,
            displacementScale: 0.3,
            displacementBias: - 0.2
        })
    );

    floor.rotation.x = - radians.quarter;
    scene.add(floor);
}

function createWalls() {
    wallsParams = {
        width: 4,
        height: 2.5,
        depth: 4 
        };
    
    const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg');
    const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg');
    const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg');
    
    wallColorTexture.colorSpace = THREE.SRGBColorSpace

    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(
            wallsParams.width,
            wallsParams.height,
            wallsParams.depth
        ),
        new THREE.MeshStandardMaterial({
            map: wallColorTexture,
            aoMap: wallARMTexture,
            roughnessMap: wallARMTexture,
            metalnessMap: wallARMTexture,
            normalMap: wallNormalTexture
        })
        );
        
    walls.position.y = wallsParams.height / 2;
    
    house.add(walls);
}

function createRoof() {
    roofParams = {
        radius: 3.5,
        height: 1.5,
        sides: 4
        };
    
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(
            roofParams.radius,
            roofParams.height,
            roofParams.sides
        ),
        new THREE.MeshStandardMaterial()
    );

    roof.position.y = wallsParams.height + (roofParams.height / 2);
    roof.rotation.y = radians.eighth;

    house.add(roof);
}

function createDoor() {
    doorParams = {
        width: 2.2,
        height: 2.2
        };
    
    // Door    
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(doorParams.width, doorParams.height),
        new THREE.MeshStandardMaterial({ color: 'red' })
    );

    door.position.set(0, 1, 2.01);

    house.add(door);
}

function createBushes() {
    const bushData = [
        { scale: 0.5, position: { x: 0.8, y: 0.2, z: 2.2 } },
        { scale: 0.25, position: { x: 1.4, y: 0.1, z: 2.1 } },
        { scale: 0.4, position: { x: -0.8, y: 0.1, z: 2.2 } },
        { scale: 0.15, position: { x: -1, y: 0.05, z: 2.6 } }
    ];

    // Loop through each bush data and create meshes
    for (let i = 0; i < bushData.length; i++) {
        const scale = bushData[i].scale;
        const position = bushData[i].position;

        const bush = new THREE.Mesh(
            new THREE.SphereGeometry(1, 16, 16), 
            new THREE.MeshStandardMaterial(),
        );

        bush.scale.set(scale, scale, scale);
        bush.position.set(position.x, position.y, position.z);

        bushes.add(bush);

    };
}

function createGraves() {
    graveParams = {
        width: 0.6,
        height: 0.8,
        depth: 0.2,
        innerRadius: 4,
        outerRadius: 5,
        tiltPower: 0.35
    };
    const graves = new THREE.Group();

    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * radians.full;
        const radius = graveParams.innerRadius + Math.random() * graveParams.outerRadius;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        const grave = new THREE.Mesh(
            new THREE.BoxGeometry(
                graveParams.width,
                graveParams.height,
                graveParams.depth
            ),
            new THREE.MeshStandardMaterial()
        );
        grave.position.set(x, Math.random() * 0.4, z);
        grave.rotation.set(
           (Math.random() - 0.5) * graveParams.tiltPower,
           (Math.random() - 0.5) * graveParams.tiltPower,
           (Math.random() - 0.5) * graveParams.tiltPower
        );
        
        graves.add(grave);
    };
    scene.add(graves);
}

function buildObjects() {
    createGround();
    createWalls();
    createRoof();
    createDoor();
    createBushes();
    createGraves();
    scene.add(house, bushes);
}

function createLighting() {
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
    directionalLight.position.set(3, 2, -8)

    scene.add(ambientLight, directionalLight);
}

function createControls() {
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
}

function onWindowResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
}

function setUpListeners() {
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function init() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    createScene();
    buildObjects();
    createLighting();
    createControls();
    animate();
    setUpListeners();
}

init();
