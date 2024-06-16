import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

let canvas;
let camera;
let renderer;
let scene;
let controls;

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

function createGround() {
    const groundParams = {
        width: 20,
        height: 20
    };

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(groundParams.width, groundParams.height),
        new THREE.MeshStandardMaterial()
    );

    floor.rotation.x = - radians.quarter;
    scene.add(floor);
}

function createHouseGroup() {
    const house = new THREE.Group();

    const wallsParams = {
        width: 4,
        height: 2.5,
        depth: 4 
        };

    const roofParams = {
        radius: 3.5,
        height: 1.5,
        sides: 4
        };

    const doorParams = {
        width: 2.2,
        height: 2.2
        };

    // Walls
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(
            wallsParams.width,
            wallsParams.height,
            wallsParams.depth
        ),
        new THREE.MeshStandardMaterial()
        );
        
    walls.position.y = wallsParams.height / 2;
    
    // Roof
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
    
    // Door    
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(doorParams.width, doorParams.height),
        new THREE.MeshStandardMaterial({ color: 'red' })
    );

    door.position.set(0, 1, 2.01);

    // Bushes
    const bushes = new THREE.Group();
    // scene.add(bushes);

    // Define the positions and scales for each bush
    const bushData = [
        { scale: 0.5, position: { x: 0.8, y: 0.2, z: 2.2 } },
        { scale: 0.25, position: { x: 1.4, y: 0.1, z: 2.1 } },
        { scale: 0.4, position: { x: -0.8, y: 0.1, z: 2.2 } },
        { scale: 0.15, position: { x: -1, y: 0.05, z: 2.6 } }
    ];

    // Loop through each bush data and create meshes
    for (let i = 0; i < bushData.length; i++) {
        const { scale, position } = bushData[i];

        const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
        const bushMaterial = new THREE.MeshStandardMaterial();
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);

        bush.scale.set(scale, scale, scale);
        bush.position.set(position.x, position.y, position.z);

        bushes.add(bush);
    };

    scene.add(house, bushes);
    house.add(walls, roof, door);
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
    createGround();
    createHouseGroup();
    createLighting();
    createControls();
    animate();
    setUpListeners();
}

init();
