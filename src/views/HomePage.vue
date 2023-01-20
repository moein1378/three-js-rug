<template>
    <div class="full-width row items-center justify-center">
        <div class="full-width processedImgConatainer" id="container">
            <img
            id="image-bg"
            class="full-width image-bg"
            src="./../assets/images/room1.jpg"
            />

            <div id="canvas-container" class="canvas-container rounded-5px"></div>

            <img
            id="image-not-floor"
            class="full-width image-not-floor"
            src="./../assets/images/room1-no-floor.png"/>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const image_bg_element = ref();
const canvas_container_element = ref();
const image_bg_element_no_floor = ref();

//RENDER RUG START
var camera, scene, renderer, rug;
var transform_controls;



var positionInfo, height, width, left, top;

var mouse = new THREE.Vector2();
var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
var raycaster = new THREE.Raycaster();
var isDragging = false;
let dragObject;
var shift = new THREE.Vector3();
var pIntersect = new THREE.Vector3();
var pNormal = new THREE.Vector3(0, 1, 0);
var planeIntersect = new THREE.Vector3();

function perspective(fov, angle, image_rug_path, image_rug_width, image_rug_height) {
	load_camera(fov, angle);
	load_rug(image_rug_path, image_rug_width, image_rug_height);
	load_controls();
	animate();

	// events
	document.addEventListener("pointermove", pointermove);
	document.addEventListener("pointerdown", pointerdown);
	document.addEventListener("pointerup", pointerup);
	window.addEventListener('resize', resize);
}
function load_camera(fov, angle) {
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize( width, height );
	canvas_container_element.value.appendChild(renderer.domElement);

	const directional_light = new THREE.SpotLight(0xffffff, 1);
	directional_light.position.set(5, 10, -10);
	directional_light.castShadow = true;
	directional_light.shadow.mapSize.width = 5024;
	directional_light.shadow.mapSize.height = 5024;
	directional_light.shadow.camera.near = 0.5;
	directional_light.shadow.camera.far = 500;
	directional_light.shadow.focus = 1;
	scene.add(directional_light);

	const light = new THREE.AmbientLight(0xffffff, 0.3);
	light.position.set(0, 0, 0);
	scene.add(light);

	camera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 30000);
	camera.position.set(0, 0, 0);
	camera.rotation.set(angle * Math.PI / 180, 0, 0);
	camera.updateProjectionMatrix();
}
function load_rug(image_path, image_width, image_height) {
	scene.remove(rug);

	rug = new THREE.Mesh();
	set_rug_geometry(rug, image_width, image_height)
	set_rug_material(rug, image_path);

	rug.rotation.set(0, 0, 0);
	rug.position.set(0, -1.3, -3);
	rug.castShadow = true;
	rug.receiveShadow = false;

	scene.add(rug);
}
function load_controls() {
	transform_controls = new TransformControls(camera, renderer.domElement);
	transform_controls.addEventListener('change', render);
	transform_controls.setSize(1);
	transform_controls.setMode('rotate');
	transform_controls.showX = false;
	transform_controls.showY = true;
	transform_controls.showZ = false;
	transform_controls.attach( rug );
	scene.add(transform_controls);
}
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
function render() {
	renderer.render(scene, camera);
}

function pointermove(event){
	mouse.x = ( (event.clientX - left) / width ) * 2 - 1;
	mouse.y = - ( (event.clientY - top) / height ) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	if (isDragging && !transform_controls.dragging) {
		raycaster.ray.intersectPlane(plane, planeIntersect);
		dragObject.position.addVectors(planeIntersect, shift);
	}
}
function pointerdown() {
	var intersects = raycaster.intersectObjects([rug]);
	if (intersects.length > 0) {
		pIntersect.copy(intersects[0].point);
		plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
		shift.subVectors(intersects[0].object.position, intersects[0].point);
		isDragging = true;
		dragObject = intersects[0].object;
	}
}
function pointerup() {
	isDragging = false;
	dragObject = null;
}
function resize() {
	positionInfo = image_bg_element.value.getBoundingClientRect();
	height = positionInfo.height;
	width = positionInfo.width;
	left = positionInfo.left;
	top = positionInfo.top;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	render();
}

function set_rug_geometry(rug, image_width, image_height) {
	var geometry = new THREE.BoxGeometry(image_width, 0, image_height);
	geometry.verticesNeedUpdate = true;
	geometry.elementsNeedUpdate = true;
	rug.geometry = geometry;
	let scaleRug = 1;
	rug.scale.set(0.7 * scaleRug, (1 / 4) * scaleRug, 0.7 * scaleRug);
}
function set_rug_material(rug, image_path) {
    image_bg_element_no_floor.value.addEventListener("load",function(){
        let texture = new THREE.TextureLoader().load(image_path);
        texture.anisotropy = 64;
        texture.needsUpdate = true;
        const mat1 = new THREE.MeshBasicMaterial({map: texture, transparent: true});
        const mat2 = new THREE.MeshBasicMaterial({transparent: true});
        var material = [mat2, mat2, mat1, mat2, mat2, mat2];
        rug.material = material;
    })
}
//RENDER RUG END

//lifecycles
onMounted(() =>{
    image_bg_element.value = document.getElementById('image-bg');
    image_bg_element_no_floor.value = document.getElementById('image-not-floor');
    canvas_container_element.value = document.getElementById('canvas-container');

    positionInfo = image_bg_element.value.getBoundingClientRect();
    height = positionInfo.height;
    width = positionInfo.width;
    left = positionInfo.left;
    top = positionInfo.top;
    const rugPic = new URL(`./../assets/images/rug1.jpg`, import.meta.url).href
    //angle: 2.7691142559051514
    //fov: 32.836980729713474
    perspective(
        2.7691142559051514,
        32.836980729713474,
        //"https://dapi.parstechai.ir/media/rug-decoration/568f1c48-dc38-434e-bd1c-8ab96163ef19.jpg",
        rugPic,
        3,
        4
    )
});
</script>
<style lang="scss" scoped>
:deep(canvas){
    width:100% !important;
    height:100% !important;
}
.processedImgConatainer {
    position: relative;
    top: 0;
    left: 0;
    height: auto;
    .image-bg {
      z-index: -1;
      position: relative;
      height: 100%;
    }

    .canvas-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
    }

    .image-not-floor {
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        height: 100%;
    }
}
</style>