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
}

function createScene() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    const fov = 75;
    const aspect = sizes.width / sizes.height;
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
    camera.position.set(4, 2, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(camera);
    renderer.render(scene, camera);
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
    createControls();
    animate();
    setUpListeners();
}

init();
