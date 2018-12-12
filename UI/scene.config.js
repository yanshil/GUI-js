window.scene = new THREE.Scene();
var container, camera, scene, renderer;

// INITIALIZE
(function () {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x8FBCD4 );
    scene.add( new THREE.AmbientLight( 0x8FBCD4, 0.4 ) );
  
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 5;
    scene.add( camera );
  
    renderer = new THREE.WebGLRenderer({antialias:true})
    renderer.setSize( window.innerWidth, window.innerHeight );

    container = document.getElementById( 'container' );
    container.appendChild(renderer.domElement);
  
    // CONTROLS
    controls = new THREE.OrbitControls( camera, container );
  
    // LIGHT
    // var light = new THREE.DirectionalLight(0xffffff, 1)
    // light.position.set(0, 0, 1).normalize()
    // scene.add(light)
    var pointLight = new THREE.PointLight( 0xffffff, 1 );
    camera.add( pointLight );

    window.addEventListener( 'resize', onWindowResize, false );
  
  })();


//========================= RayCast ================================
// https://threejs.org/docs/#api/en/core/Raycaster

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {

    // Orbit Controls cannot use this???? What????
    // https://github.com/sotownsend/dat-gui/issues/5
    // event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects(scene.children);

    console.log(intersects);

    if (intersects.length > 0) {

        // intersects[ 0 ].object.material.color.set( 0x000000 );

        console.log(intersects[0]);
        // point, face, object....
        console.log(intersects[0].point);

    }
    if (intersects.length == 0) {
        cube.material.color.set( 0x00ff00 );
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);

//========================== Render ================================

var render = function () {

    requestAnimationFrame( render );
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    renderer.render( scene, camera );
};

render();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}