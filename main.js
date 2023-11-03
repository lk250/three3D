// 导入threeJs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

function domRender() {
  const El = {
    moveCar: document.querySelector(".move"),
    descCar: document.querySelector(".desc"),
    rotateCar: document.querySelector(".carRotate"),
    carScale: document.querySelector(".carScale"),
    topRobot: document.querySelector(".topRobot"),
  }
  // 用于存储模型引用
  const carInfo = { wheels: []};
  let robot;
  // 创建场景 ----------
  const scene = new THREE.Scene();
  // 设置场景背景色
  scene.background = new THREE.Color("#fff");
  // 设置场景内默认纹理
  // scene.environment = new THREE.Color("#000");

  // 创建相机 ----------
  const camera = new THREE.PerspectiveCamera(
    75, // 视野范围
    window.innerWidth / window.innerHeight, // 
    0.1,
    1000
  )
  // 设置相机位置
  camera.position.set(2, 2, 10);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    // 开启抗锯齿
    antialias: true
    // 如果你没有给three.js传canvas，three.js会自己创建一个 ，但是你必须手动把它添加到文档中
  });
  // 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 将webgl渲染的canvas内容添加到body renderer.domElement === canvas
  document.body.appendChild(renderer.domElement);

  // 添加坐标辅助器
  const axesHelper = new THREE.AxesHelper(15);
  scene.add(axesHelper);

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(100, 100);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  //创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 控制器更新
  controls.addEventListener('change', render);

  //  渲染函数
  function render() {
    renderer.render(scene, camera);
  }

  // 添加机器人
  let robotDracoLoader = new DRACOLoader();
  robotDracoLoader.setDecoderPath("/draco/gltf/");
  robotDracoLoader.setDecoderConfig({ type: "js" });
  let robotGltfLoader = new GLTFLoader();
  robotGltfLoader.setDRACOLoader(robotDracoLoader);
  robotGltfLoader.load("/model/robot.glb", (gltf) => {
    robot = gltf.scene;
    scene.add(robot);
    render()
  });

    // 创建汽车相关材质
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });

  const frontMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  const hoodMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });
  const wheelsMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 1,
    roughness: 0.1,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    transparent: true,
  });
  // 添加gltf汽车模型
  const carLoader = new GLTFLoader();
  const carDracoLoader = new DRACOLoader();
  carDracoLoader.setDecoderPath("./dracoBm/gltf/");
  carLoader.setDRACOLoader(carDracoLoader);
  carLoader.load("./model/bmw01.glb", (gltf) => {
    carInfo.scene = gltf.scene;
    const bmw = gltf.scene;
    // console.log(gltf);
    bmw.traverse((child) => {
      // console.log(child, 'child');
      if (child.isMesh) {
        // console.log(child.name);
      }
      // 判断是否是轮毂
      if (child.isMesh && child.name.includes("轮毂")) {
        child.material = wheelsMaterial;
        carInfo.wheels.push(child);
      }
      // 判断是否是车身
      if (child.isMesh && child.name.includes("Mesh002")) {
        carInfo.carBody = child;
        carInfo.carBody.material = bodyMaterial;
      }
      // 判断是否是前脸
      if (child.isMesh && child.name.includes("前脸")) {
        child.material = frontMaterial;
        carInfo.frontCar = child;
      }
      // 判断是否是引擎盖
      if (child.isMesh && child.name.includes("引擎盖_1")) {
        child.material = hoodMaterial;
        carInfo.hoodCar = child;
      }
      // 判断是否是挡风玻璃
      if (child.isMesh && child.name.includes("挡风玻璃")) {
        child.material = glassMaterial;
        carInfo.glassCar = child;
      }
    });
    // console.log('carInfo', carInfo);
    scene.add(bmw);
    render()
  }
  );

  // 添加灯光
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(0, 0, 10);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(0, 0, -10);
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 1);
  light3.position.set(10, 0, 0);
  scene.add(light3);
  const light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(-10, 0, 0);
  scene.add(light4);
  const light5 = new THREE.DirectionalLight(0xffffff, 1);
  light5.position.set(0, 10, 0);
  scene.add(light5);
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
  light6.position.set(5, 10, 0);
  scene.add(light6);
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
  light7.position.set(0, 10, 5);
  scene.add(light7);
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
  light8.position.set(0, 10, -5);
  scene.add(light8);
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
  light9.position.set(-5, 10, 0);
  scene.add(light9);
  El.descCar.onclick = function () {
    function getRandomColor() {
      // 生成随机的红、绿和蓝通道的值
      var red = Math.floor(Math.random() * 256); // 0 到 255
      var green = Math.floor(Math.random() * 256); // 0 到 255
      var blue = Math.floor(Math.random() * 256); // 0 到 255
      // 将RGB值组合成颜色字符串
      var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
      return color;
  }
    const color = getRandomColor()
    bodyMaterial.color.set(color);
    frontMaterial.color.set(color);
    hoodMaterial.color.set(color);
    wheelsMaterial.color.set(color);
    render()
  }
  El.moveCar.onclick = function () {
    carInfo.scene.position.z += 1;
    robot.position.z += 1;
    render()
  }
  El.topRobot.onclick = function () {
    robot.position.y += 1;
    render()
  }
  El.rotateCar.onclick = function () {
    carInfo.scene.rotation.y += Math.PI / 6;
    render()
  }
  El.carScale.onclick = function () {
    carInfo.scene.scale.x += 1;
    carInfo.scene.scale.y += 1;
    carInfo.scene.scale.z += 1;
    // carInfo.wheels.forEach((item) => {
    //   item.scale.x += 1;
    //   item.scale.y += 1;
    //   item.scale.z += 1;
    // })
    render()
  }
  render();
  window.addEventListener("resize", () => {
    // console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });
}

window.onload = domRender;
