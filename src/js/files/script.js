// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

// Підключення THREE

import * as THREE from 'three';


//=============== Add class Active ===============//

document.addEventListener("DOMContentLoaded", function () {
   const applyActiveClass = (selector, activeClass) => {
      const menuLinks = document.querySelectorAll('.menu__link');
      const currentPath = window.location.pathname.split('/').pop();

      console.log(currentPath);

      menuLinks.forEach(link => {
         if (link.getAttribute('href') === currentPath) {
            link.classList.add(...activeClass);
         } else {
            link.classList.remove(...activeClass);
         }
      });
   };

   applyActiveClass('.menu__link', ['active']);
   applyActiveClass('.tabs-menu__link', ['active', 'active--tab']);
});

function setViewportWidth() {
   document.documentElement.style.setProperty('--viewport-width', window.innerWidth);
}

window.addEventListener('load', setViewportWidth);
window.addEventListener('resize', setViewportWidth);

//=============== Change Slide Image ===============//

function changeSlideImage() {
   const activeSlide = document.querySelector('.swiper-slide-active');
   const imageElement = document.querySelector('.crew-page__image img');

   if (activeSlide && imageElement) {
      const imageSrc = activeSlide.getAttribute('data-image');
      if (imageSrc) {
         imageElement.src = `img/crew/${imageSrc}`;
      }
   }
}

window.addEventListener('load', () => {
   const swiperContainer = document.querySelector('.swiper');
   if (swiperContainer) {
      swiperContainer.addEventListener('transitionend', () => {
         changeSlideImage();
      });
   }
});

window.addEventListener('load', changeSlideImage);

//=============== Stars Animation ===============//

let scene, camera, renderer, starGeo, stars;

function init() {
   scene = new THREE.Scene();
   camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
   camera.position.z = 1;
   camera.rotation.x = Math.PI / 2;

   renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   starGeo = new THREE.BufferGeometry();
   let starVertices = new Float32Array(6000 * 3);
   let velocities = new Float32Array(6000);

   for (let i = 0; i < 6000; i++) {
      let x = Math.random() * 600 - 300;
      let y = Math.random() * 600 - 300;
      let z = Math.random() * 600 - 300;

      starVertices[i * 3] = x;
      starVertices[i * 3 + 1] = y;
      starVertices[i * 3 + 2] = z;

      velocities[i] = 0;
   }

   starGeo.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
   starGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

   let sprite = new THREE.TextureLoader().load('img/animation/star.webp');
   let starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.7,
      map: sprite,
      transparent: true
   });

   stars = new THREE.Points(starGeo, starMaterial);
   scene.add(stars);

   animate();
}

function animate() {
   let positions = starGeo.attributes.position.array;
   let velocities = starGeo.attributes.velocity.array;

   for (let i = 0; i < positions.length / 3; i++) {
      velocities[i] += 0.02;
      positions[i * 3 + 1] -= velocities[i];

      if (positions[i * 3 + 1] < -200) {
         positions[i * 3 + 1] = 200;
         velocities[i] = 0;
      }
   }

   starGeo.attributes.position.needsUpdate = true;
   stars.rotation.y += 0.002;
   renderer.render(scene, camera);
   requestAnimationFrame(animate);
}

const mainPage = document.getElementById('main');
const starbutton = document.getElementById('starbutton');
const animationCountdown = document.getElementById('animationCountdown');

let count = 3;
function updateCountdown() {
   animationCountdown.innerHTML = `${count}`;
   if (count > 0) {
      count--;
   }
}

if (starbutton) {
   starbutton.addEventListener('click', function () {

      mainPage.style.display = 'none';
      document.getElementById('animationContainer').style.display = 'block';
      init();

      updateCountdown();

      const countdownInterval = setInterval(() => {
         updateCountdown();
         if (count <= 0) {
            clearInterval(countdownInterval);
         }
      }, 1000);

      setTimeout(function () {

         window.location.href = 'destination.html';
      }, 3000);

   })
}

//=============== Close menu ===============//

import { menuClose } from './functions.js';


document.addEventListener('click', function (event) {
   const menuBody = document.querySelector('.menu__body').contains(event.target);
   const isMenuIcon = event.target.closest('.icon-menu');

   if (!menuBody && !isMenuIcon) {
      menuClose();
   }
})