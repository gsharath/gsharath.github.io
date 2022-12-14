import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

var isMobile = false;
var antialias = true;

// three var
var camera, scene, light, renderer, canvas, controls;
var meshs = [];
var grounds = [];
var geoBox, geoCyl, buffgeoSphere, buffgeoBox;
var matBox, matSphere, matBoxSleep, matSphereSleep, matGround;
var types, sizes, positions, chairGeometry;
var ToRad = Math.PI / 180;

//oimo var
var world = null;
var bodys = null;
var infos;
var type=1;

init();
loop();

function init() {

    var n = navigator.userAgent;
    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)){ isMobile = true;  antialias = false; }

    infos = document.getElementById("info");

    canvas = document.getElementById("canvas");

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 160, 400 );

    controls = new OrbitControls( camera, canvas );
    controls.target.set(0, 20, 0);
    controls.update();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas:canvas, precision: "mediump", antialias:antialias });
    renderer.setSize( window.innerWidth, window.innerHeight );

    var materialType = 'MeshBasicMaterial';
    
    if(!isMobile){

        scene.add( new THREE.AmbientLight( 0x3D4143 ) );
        light = new THREE.DirectionalLight( 0xffffff , 1);
        light.position.set( 300, 1000, 500 );
        light.target.position.set( 0, 0, 0 );
        light.castShadow = true;
        var d = 300;
        light.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d,  500, 1600 );
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;
        scene.add( light );

        materialType = 'MeshPhongMaterial';

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;
    }

    // background
    var buffgeoBack = new THREE.BufferGeometry();
    buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(8000,1) );
    var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:gradTexture([[1,0.75,0.5,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false }  ));
    back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*ToRad));
    scene.add( back );

    geoBox = new THREE.BoxGeometry( 1, 1, 1 );
    geoCyl = new THREE.CylinderGeometry( 0.5, 0.5, 1, 6, 1 );

    buffgeoSphere = new THREE.BufferGeometry();
    buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1 , 20, 10 ) );

    buffgeoBox = new THREE.BufferGeometry();
    buffgeoBox.fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) );

    matSphere = new THREE[materialType]( { map: basicTexture(0), name:'sph' ,specular: 0xFFFFFF, shininess: 120, transparent: true, opacity: 0.9 } );
    matBox = new THREE[materialType]( {  map: basicTexture(2), name:'box' } );
    matSphereSleep = new THREE[materialType]( { map: basicTexture(1), name:'ssph', specular: 0xFFFFFF, shininess: 120 , transparent: true, opacity: 0.7} );
    matBoxSleep = new THREE[materialType]( {  map: basicTexture(3), name:'sbox' } );
    matGround = new THREE[materialType]( { shininess: 10, color:0x3D4143, transparent:true, opacity:0.5 } );

    // events

    window.addEventListener( 'resize', onWindowResize, false );

    // physics

    initOimoPhysics();

}

function loop() {
    
    updateOimoPhysics();
    renderer.render( scene, camera );
    // requestAnimationFrame( loop );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function addStaticBox(size, position, rotation) {
    var mesh = new THREE.Mesh( buffgeoBox, matGround );
    mesh.scale.set( size[0], size[1], size[2] );
    mesh.position.set( position[0], position[1], position[2] );
    mesh.rotation.set( rotation[0]*ToRad, rotation[1]*ToRad, rotation[2]*ToRad );
    scene.add( mesh );
    grounds.push(mesh);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function initChairGeometry() {
    types = [ 'box', 'box', 'box', 'box', 'box', 'box', 'box', 'box' ];
    sizes = [ 30,5,30,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  23,10,3 ];
    positions = [ 0,0,0,  12,-16,12,  -12,-16,12,  12,-16,-12,  -12,-16,-12,  12,16,-12,  -12,16,-12,  0,25,-12 ];

    var g = new THREE.Geometry();
    var mesh, n, m;
    for(var i=0; i<types.length; i++){
        n = i*3;
        m = new THREE.Matrix4().makeTranslation( positions[n+0], positions[n+1], positions[n+2] );
        m.scale(new THREE.Vector3(sizes[n+0], sizes[n+1], sizes[n+2]));
        
        if(i==1 || i==2 || i==3 || i==4 || i==5 || i==6) g.merge(geoCyl, m);
        else g.merge(geoBox,m);
    }
    chairGeometry = new THREE.BufferGeometry();
    chairGeometry.fromGeometry( g );
}

function clearMesh(){
    var i=meshs.length;
    while (i--) scene.remove(meshs[ i ]);
    i = grounds.length;
    while (i--) scene.remove(grounds[ i ]);
    grounds = [];
    meshs = [];
}

//----------------------------------
//  OIMO PHYSICS
//----------------------------------

function initOimoPhysics(){

    world = new OIMO.World( {info:true, worldscale:100} );
    initChairGeometry();
    populate(1);
    //setInterval( updateOimoPhysics, 1000/60 );
}

function populate(n) {

    var max = 1;

    if(n===1) type = 1
    else if(n===2) type = 2;

    var pos = [];
    //else if(n===3) type = 3;

    // reset old
    clearMesh();
    world.clear();
    bodys=[];

    var b;

  var ground = world.add({size:[1000, 40, 1000], pos:[0,-20,0]});
  var ground2 = world.add({size:[400, 40, 400], pos:[0,130,-600], rot:[45,0,0]});
  var mesh = addStaticBox([1000, 40, 1000], [0,-20,0], [0,0,0]);
  var mesh2 = addStaticBox([400, 40, 400], [0,130,-600], [45,0,0]);
  ground.connectMesh(mesh);
  ground2.connectMesh(mesh2);

  var i = max;
  var j, k=0, l=0;


  while (i--){
    pos[1] = 50;
    pos[0] = -400+(50*l);
    pos[2] = -400+(50*k);

    l++;
    if(l>16){k++; l=0}

    //b = new OIMO.Body({
    bodys[i] = world.add({
      type:types,
      size:sizes,
      pos:pos,
      posShape:positions,
      move:true, 
      world:world, 
      name:'box'+i, 
      config:[0.2,0.4,0.1]
    });

    //bodys[i] = b.body;

    j = Math.round(Math.random()*2);

    if(j===1)meshs[i] = new THREE.Mesh( chairGeometry, matBox );
    else meshs[i] = new THREE.Mesh( chairGeometry, matSphere );

    meshs[i].castShadow = true;
    meshs[i].receiveShadow = true;

    scene.add(meshs[i]);
    bodys[i].connectMesh(meshs[i]);
  }

  //b = new OIMO.Body({type:'sphere', size:[80], pos:[0,1000,-600], move:true, world:world});
  //bodys[max] = b.body;
  bodys[max] = world.add({type:'sphere', size:[80], pos:[0,1000,-600], move:true, world:world});
  meshs[max] = new THREE.Mesh( buffgeoSphere, matSphere );
  meshs[max].scale.set( 80, 80, 80 );
bodys[max].connectMesh(meshs[max]);
  scene.add(meshs[max]);
  meshs[max].castShadow = true;
  meshs[max].receiveShadow = true;
world.play();
} 

function updateOimoPhysics() {

    if(world == null) return;

    // update world
    // world.step();

    var x, y, z, mesh, body, i = bodys.length;
    
    while (i--){
        body = bodys[i];
        mesh = meshs[i];

        if(!body.sleeping){

            // // apply physics mouvement
            // mesh.position.copy(body.getPosition());
            // mesh.quaternion.copy(body.getQuaternion());

            // change material
            if(mesh.material.name === 'sbox') mesh.material = matBox;
            if(mesh.material.name === 'ssph') mesh.material = matSphere; 

            // reset position
            if(mesh.position.y<-100){
                x = -100 + Math.random()*200;
                z = -100 + Math.random()*200;
                y = 100 + Math.random()*1000;
                body.resetPosition(x,y,z);
            }
        } else {
            if(mesh.material.name === 'box') mesh.material = matBoxSleep;
            if(mesh.material.name === 'sph') mesh.material = matSphereSleep;
        }
    }

    infos.innerHTML = world.getInfo();
    
}


//----------------------------------
//  TEXTURES
//----------------------------------

function gradTexture(color) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d");
    c.width = 16; c.height = 256;
    var gradient = ct.createLinearGradient(0,0,0,256);
    var i = color[0].length;
    while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
    ct.fillStyle = gradient;
    ct.fillRect(0,0,16,256);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
}

function basicTexture(n){

    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    var colors = [];
    if(n===0){ // sphere
        colors[0] = "#99999A";
        colors[1] = "#cccccD";
    }
    if(n===1){ // sphere sleep
        colors[0] = "#666667";
        colors[1] = "#99999A";
    }
    if(n===2){ // box
        colors[0] = "#AA8058";
        colors[1] = "#FFAA58";
    }
    if(n===3){ // box sleep
        colors[0] = "#383838";
        colors[1] = "#AA8038";
    }
    let grd=ctx.createLinearGradient(0,0,0,64);
    grd.addColorStop(0,colors[1]);
    grd.addColorStop(1,colors[0]);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 64, 64);

    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;

}

