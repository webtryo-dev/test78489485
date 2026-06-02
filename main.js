import * as THREE from 'three';

// --- Form Handling ---
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const business = document.getElementById('business').value;
  const phone = document.getElementById('phone').value;
  
  const btn = e.target.querySelector('button');
  const originalText = btn.innerText;
  
  btn.innerText = 'Sending...';
  btn.disabled = true;
  
  // Simulate network request
  setTimeout(() => {
    btn.innerText = originalText;
    btn.disabled = false;
    e.target.reset();
    
    const msg = document.getElementById('formMessage');
    msg.style.color = '#10b981'; // green
    msg.innerText = `Thanks ${name}! We'll reach out to ${business} shortly at ${phone}.`;
    
    setTimeout(() => {
      msg.innerText = '';
    }, 5000);
  }, 1500);
});

// --- Smooth Scrolling for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// --- Three.js 3D Interactive Setup ---
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Setup renderer with transparent background
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0x7b42f6, 1.5, 50); // Purple light
  pointLight.position.set(-5, 0, 5);
  scene.add(pointLight);

  // Group for floating objects
  const group = new THREE.Group();
  scene.add(group);

  // Create an abstract glowing sphere/gem in the center
  const geoIcosahedron = new THREE.IcosahedronGeometry(1.5, 1);
  const matIcosahedron = new THREE.MeshPhysicalMaterial({
    color: 0x9f7aea,
    metalness: 0.5,
    roughness: 0.2,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const icosahedron = new THREE.Mesh(geoIcosahedron, matIcosahedron);
  group.add(icosahedron);
  
  // Create orbiting rings or smaller shapes
  const ringGeo = new THREE.TorusGeometry(2.5, 0.05, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x7b42f6, metalness: 0.8, roughness: 0.2 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);
  
  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.y = Math.PI / 2;
  group.add(ring2);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates from -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Idle rotation
    group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.5;
    group.rotation.y += 0.005;
    
    // Mouse parralax effect
    group.position.x += (mouseX * 0.5 - group.position.x) * 0.05;
    group.position.y += (mouseY * 0.5 - group.position.y) * 0.05;
    
    // Rotate icosahedron independently
    icosahedron.rotation.x += 0.01;
    icosahedron.rotation.y += 0.01;
    
    // Orbit rings
    ring1.rotation.y = elapsedTime * 0.5;
    ring2.rotation.x = elapsedTime * 0.4;
    
    renderer.render(scene, camera);
  }
  
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initThreeJS);
