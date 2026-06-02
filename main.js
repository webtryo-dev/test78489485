import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Form Handling ---
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const business = document.getElementById('business').value;
    const phone = document.getElementById('phone').value;
    
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Sending...';
    btn.disabled = true;
    
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
}

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

// --- GSAP Scroll Animations for HTML Elements ---
function initScrollAnimations() {
  // Fade up hero elements on load
  gsap.to('.fade-up', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
  });

  // Slide fade for sections as you scroll
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide) => {
    const elements = slide.querySelectorAll('.slide-fade');
    if (elements.length > 0) {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: slide,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });
    }
  });

  // Counter Animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    
    // Create a proxy object to animate
    let obj = { val: 0 };
    
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: counter,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        counter.innerHTML = Math.floor(obj.val) + suffix;
      }
    });
  });
}

// --- Three.js 3D Interactive Setup ---
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  
  // Setup camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;
  
  // Setup renderer with transparent background
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  
  // Lighting for Dark Mode (Deep purples and stark whites)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  const purpleLight = new THREE.DirectionalLight(0x9f7aea, 2.0);
  purpleLight.position.set(-5, -5, -5);
  scene.add(purpleLight);

  // Group for floating objects
  const group = new THREE.Group();
  scene.add(group);

  // Premium glossy dark material
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.2,
    metalness: 0.8,
  });

  // Glow material
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0x9f7aea,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.5
  });

  // Main floating geometric shape (Torus Knot)
  const knotGeo = new THREE.TorusKnotGeometry(2, 0.6, 128, 32);
  const mainObject = new THREE.Mesh(knotGeo, darkMaterial);
  mainObject.castShadow = true;
  mainObject.receiveShadow = true;
  group.add(mainObject);
  
  // Orbiting glow sphere
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const glowSphere = new THREE.Mesh(sphereGeo, glowMaterial);
  glowSphere.position.set(4, 2, 0);
  group.add(glowSphere);

  // Mouse interaction for parallax
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // GSAP ScrollTrigger to tie 3D object rotation/position to scroll
  gsap.to(group.rotation, {
    y: Math.PI * 2, // Full rotation
    x: Math.PI / 2,
    ease: "none",
    scrollTrigger: {
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1 // smooth scrubbing
    }
  });

  gsap.to(group.position, {
    y: -2, // Move down slightly as user scrolls
    ease: "none",
    scrollTrigger: {
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  // Animation Loop for idle floating and mouse parallax
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Idle animations
    mainObject.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;
    
    // Orbiting sphere
    glowSphere.position.x = Math.cos(elapsedTime) * 4;
    glowSphere.position.z = Math.sin(elapsedTime) * 4;
    glowSphere.position.y = Math.sin(elapsedTime * 2) * 2;
    
    // Mouse parallax effect (added to the GSAP-driven base rotation)
    // We apply this to the main scene camera instead of the group to not fight GSAP
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initScrollAnimations();
});
