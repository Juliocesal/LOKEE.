import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Configuración básica de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);



renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita para interacción
const controls = new OrbitControls(camera, renderer.domElement);

// Establecer color de fondo blanco
scene.background = new THREE.Color(0xffffff);

renderer.outputEncoding = THREE.sRGBEncoding;

// Añadir una luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Añadir una luz direccional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // sombras más suaves

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(lightHelper); 

function centerAndFrameObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  object.position.sub(center); // Centra el modelo

  controls.reset();
  controls.maxDistance = size * 0.7;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.maxPolarAngle = Math.PI / 2;

  camera.near = size / 100;
  camera.far = size * 100;
  camera.updateProjectionMatrix();

  camera.position.set(size, size, size);
  camera.lookAt(0, 0, 0);
}


function loadModel(modelName) {
  const mtlPath = `/Frontend/modelos/casa2/1erpiso/`;
  const objPath = `/Frontend/modelos/casa2/1erpiso/`;

  const mtlLoader = new MTLLoader();
  mtlLoader.setPath(mtlPath);
  mtlLoader.load(`${modelName}.mtl`, (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(objPath);
    objLoader.load(`${modelName}.obj`, (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Limpia modelos anteriores si quieres
      while (scene.children.length > 5) {
        const obj = scene.children.pop();
        obj.geometry?.dispose?.();
        obj.material?.dispose?.();
        scene.remove(obj);
      }

      scene.add(object);

      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      controls.reset();
      object.position.sub(center);
      camera.position.set(size, size, size);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      scene.add(object);
centerAndFrameObject(object); // 👈 Llama a esta función aquí

    });
  });
}

loadModel('base');

window.loadModel = loadModel;



const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) {
  renderer.shadowMap.enabled = false;
}

  scene.fog = new THREE.Fog(0xffffff, 10, 50);


renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;


// Posicionar la cámara
camera.position.z = 5;

// Manejar el redimensionamiento de la ventana
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Función de animación
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
