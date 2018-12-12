// 1. Group is not supported
// 2. Orbit Control is not supported

var container, camera, scene, renderer;

/**
 * scene
 */
scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x8FBCD4 );
// scene.add( new THREE.AmbientLight( 0x8FBCD4, 0.4 ) );

/**
 * camera
 */
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 5;
scene.add( camera );

/**
 * renderer
 */
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/**
 * container
 */
container = document.getElementById( 'container' );
container.append(renderer.domElement);

/**
 * Light
 */
var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.x = 10;
pointLight.position.y = 10;
pointLight.position.z = 10;
camera.add( pointLight );


/**
 * Event Listener
 */
window.addEventListener( 'resize', onWindowResize, false );

/**
 * OrbitControls
 */
// var controls = new THREE.OrbitControls( camera, container );
// ============================================

var createCutCylinder = function(){
    var material = 
        new THREE.MeshLambertMaterial({color:0xFF0000});
    
    var cube = new THREE.Mesh(new THREE.CubeGeometry(3, 1, 5, 3, 1, 5),material);
    // cube.position.z=-10;    
    var origCsg	= THREE.CSG.toCSG(cube);

    // var cld_group = new THREE.Group();
    
    var cld1 = new THREE.Mesh(new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 ),material);
    
    var cld2 = new THREE.Mesh(new THREE.CylinderGeometry( 0.5, 0.5, 1, 32 ),material);
    cld2.position.x = 0.5;
    cld2.position.z = 1;

    // cld_group.add(cld1);
    // cld_group.add(cld2);

    var cld_csg1 = THREE.CSG.toCSG(cld1);
    var cld_csg2 = THREE.CSG.toCSG(cld2);
    var substractedCsg = origCsg.subtract(cld_csg1);
    substractedCsg = substractedCsg.subtract(cld_csg2);
    console.log(substractedCsg);
    
    var resultMesh = new THREE.Mesh(THREE.CSG.fromCSG(substractedCsg),material);

    console.log(resultMesh);
    return resultMesh;
  
};

var crossSectionCylinder = createCutCylinder();


// scene.add(light);
scene.add(crossSectionCylinder);

var render = function(){
   renderer.render(scene,camera);
}

var animate = function(){
    requestAnimationFrame(animate); 
    crossSectionCylinder.rotation.y+=0.01;
    crossSectionCylinder.rotation.z+=0.01;
    render();
}

animate();

//==========================================================

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}