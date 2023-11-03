// 导入threeJs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const El = {
  rtBtn: document.querySelector(".right"),
  tpBtn: document.querySelector(".top"),
  scaleBtn: document.querySelector(".scale"),
  rotateBtn: document.querySelector(".rotate"),
  colorBtn: document.querySelector(".color"),
}
// 创建场景
const scene = new THREE.Scene();
// 初始化场景

// 设置场景背景色
scene.background = new THREE.Color("#fff");
// 设置场景内默认纹理
scene.environment = new THREE.Color("#000");

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, // 视野范围
  window.innerWidth / window.innerHeight, // 
  0.1,
  1000  
)

// 设置相机位置
camera.position.set(0, 0, 10);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 开启抗锯齿
  antialias: true
  // 如果你没有给three.js传canvas，three.js会自己创建一个 ，但是你必须手动把它添加到文档中
});

// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);
// console.log('renderer.domElement', renderer.domElement)

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})

// 材质2
const material2 = new THREE.MeshBasicMaterial({
  color: 'green',
})

// 使用几何体和材质创建网格模型
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material2);
cube1.add(cube2);
cube2.position.set(0, 0, 0);
cube1.position.set(0.5, 0.5, 0.5);
cube2.scale.set(0.5, 0.5, 0.5);

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 添加坐标辅助器
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// 将网格模型添加到场景中
scene.add(cube1);
// scene.add(cube2);

// 测试三角形------------------------------------------
const geometryTest = new THREE.BufferGeometry();
// 顶点是有序的，逆时针为正面 
const vertices = new Float32Array( [
	 0.0,  0.0,  1.0,
	 0.0, 1.0,  1.0,
	 1.0,  1.0,  1.0,
	//  1.0,  1.0,  1.0,
	 1.0,  0.0,  1.0,
	// 0.0,  0.0,  1.0,
] );
// itemSize = 3 因为每个顶点都是一个三元组。
geometryTest.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// 使用索引绘制, 将同一位置的顶点通过索引形成复用
const indices = new Uint16Array( [
  0, 1, 2, 2, 3, 0
]);
// // 创建索引属性
geometryTest.setIndex(new THREE.BufferAttribute( indices, 1 ) );
// 设置两个顶点组，形成2个材质
geometryTest.addGroup( 0, 3, 0 ); // 索引起始位置，索引个数，材质索引
geometryTest.addGroup( 3, 3, 1 );
const materialTest = new THREE.MeshBasicMaterial( { 
  color: 'yellow', 
  // 显示线框
  wireframe: true,
  // 设置双面可用
  side: THREE.DoubleSide 
} );
const materialTest2 = new THREE.MeshBasicMaterial( {
  color: 'pink',
  // 显示线框
  // wireframe: true,
  // 设置双面可用
  side: THREE.DoubleSide
})
// const mesh = new THREE.Mesh( geometryTest, materialTest ); 
const mesh = new THREE.Mesh( geometryTest, [materialTest2, materialTest] );
// scene.add( mesh );
// --------------------------------------------------------

 // 添加网格地面
 const gridHelper = new THREE.GridHelper(100, 100);
 gridHelper.material.opacity = 0.2;
 gridHelper.material.transparent = true;
 scene.add(gridHelper);

//  添加相机辅助
// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

function render() {
  // console.log('this', this)
  // 渲染器渲染
  renderer.render(scene, camera);
}

render();

// 控制器更新
controls.addEventListener('change', render);

El.rtBtn.onclick = function () {
  cube1.position.x += 1;
  render();
}
El.tpBtn.onclick = function () {
  // cube1.position.y += 1;
  cube2.position.y += 1;
  render();
}
El.scaleBtn.onclick = function () {
  console.log('cube1', cube1)
  console.log('cubechild', cube1.children[0] === cube2)
  const { x, y, z} = cube1.scale;
  // 相对基准的缩放，不是在上一次的缩放基础上缩放
  cube1.scale.set(x + 1, y + 1, z + 1);
  render();
}
El.rotateBtn.onclick = function () {
  // 旋转单位为弧度 2PI为一圈
  cube1.rotation.y += Math.PI / 4;
  render();
}
El.colorBtn.onclick = function () {
  // console.log(material.color.r, 'color')
  material.color.set(material.color.r === 1 ? 'green' : 'red');
  render();
}

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


// window.addEventListener("dblclick", () => {
//   // fullscreenElement只读属性返回当前在此文档中以全屏模式显示的元素。
//   // 如果文档当前未使用全屏模式，则返回值为null。
//   // 使用element.requestFullscreen()方法以全屏模式查看元素，exitFullscreen方法退出全屏
//   const fullScreenElement = document.fullscreenElement;
//   if (!fullScreenElement) {
//     //   双击控制屏幕进入全屏，退出全屏
//     // 让画布对象全屏
//     // renderer.domElement.requestFullscreen();
//     // body全屏
//     document.body.requestFullscreen();
//   } else {
//     //   退出全屏，使用document对象
//     document.exitFullscreen();
//   }
// });