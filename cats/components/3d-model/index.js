import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ThreeDModelComponent {
    constructor(parent, modelPath) {
        this.parent = parent;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.animationId = null;
        this.isInitialized = false;
        this.controls = null;
    }

    initThree() {
        if (this.isInitialized) return;
        
        const container = this.parent;
        if (!container) return;

        container.innerHTML = '';
        
        const width = container.clientWidth || 800;
        const height = 400;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f7);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(5, 3, 8);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x0a0a2a);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = false;
        this.controls.enableZoom = true;

        this.addLights();
        this.loadModel();
        this.animate();

        this.isInitialized = true;
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 10, 7);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        const fillLight = new THREE.PointLight(0x4466cc, 0.5);
        fillLight.position.set(0, -2, 0);
        this.scene.add(fillLight);

        const rimLight = new THREE.PointLight(0xffaa66, 0.6);
        rimLight.position.set(-2, 1, -3);
        this.scene.add(rimLight);
        
        const accentLight = new THREE.PointLight(0xff66aa, 0.5);
        accentLight.position.set(2, 1, 2);
        this.scene.add(accentLight);
        
        const frontLight = new THREE.PointLight(0x88aaff, 0.4);
        frontLight.position.set(0, 1, 4);
        this.scene.add(frontLight);
    }

    loadModel() {
        const loader = new GLTFLoader();
        const modelUrl = window.location.origin + this.modelPath;
        
        loader.load(
            modelUrl,
            (gltf) => {
                this.model = gltf.scene;

                const box = new THREE.Box3().setFromObject(this.model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2.5 / maxDim;
                this.model.scale.set(scale, scale, scale);
                this.model.position.x = -center.x * scale;
                this.model.position.y = -center.y * scale;
                this.model.position.z = -center.z * scale;
                
                this.model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                
                this.scene.add(this.model);
                
                this.fitCameraToModel();
            },
            (xhr) => {
                xhr.total;
            },
            (error) => {
                console.error('Ошибка загрузки модели:', error);
                this.addFallbackModel();
            }
        );
    }
    
    fitCameraToModel() {
        if (!this.model) return;
        
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 1.5;
        
        this.camera.position.set(distance, distance * 0.8, distance);
        this.camera.lookAt(center);
        
        if (this.controls) {
            this.controls.target.copy(center);
            this.controls.update();
        }
    }

    addFallbackModel() {
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff6b6b, 
            metalness: 0.8, 
            roughness: 0.2,
            emissive: 0x331111
        });
        const fallbackModel = new THREE.Mesh(geometry, material);
        fallbackModel.castShadow = true;
        fallbackModel.position.set(0, 0, 0);
        this.scene.add(fallbackModel);
        this.model = fallbackModel;
        
        const ringGeometry = new THREE.TorusGeometry(1.3, 0.05, 32, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa44, metalness: 0.9 });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        this.scene.add(ring);
        this.ring = ring;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.model) {
            this.model.rotation.y += 0.005;
            
            if (this.ring) {
                this.ring.rotation.y += 0.01;
                this.ring.rotation.x += 0.005;
            }
        }
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
        if (this.scene) {
            this.scene.clear();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        this.isInitialized = false;
    }

    render() {
        this.parent.innerHTML = '';
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'text-center text-white p-5';
        loadingDiv.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Загрузка 3D модели...</span></div><p class="mt-2">Загрузка 3D модели...</p>';
        this.parent.appendChild(loadingDiv);
        
        setTimeout(() => {
            this.initThree();
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
        }, 100);
    }
}