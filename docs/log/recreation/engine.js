/*
	engine.js
*/

(function(){

	var stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );

	var scene,camera,focus,renderer;
	var _particle,_mesh,_sphere;
	var gpuCompute;
	var velVar, posVar;
	var NUM = 1024;

	var gui = new dat.GUI();

	init();
	setup();
	update();

	var props = {
		speed: 100,
		scale: 0.5,
		slow: 0.94,
		offsetX: Math.random() * 1000 - 500,
		offsetY: Math.random() * 1000 - 500
	}

	var folder = gui.addFolder('Curl Noise');//新規フォルダ(タブ)作成
	folder.add( props, 'speed', 0, 1000.0 ).step( 10 ).onChange( setGeoVal );
	folder.add( props, 'scale', 0.01, 5.0 ).step( 0.01 ).onChange( setGeoVal );
	folder.add( props, 'slow', 0.9, 1.0 ).step( 0.001 ).onChange( setGeoVal );
	folder.add( props, 'offsetX', -1000, 1000 ).step( 0.1 ).onChange( setGeoVal );
	folder.add( props, 'offsetY', -1000, 1000 ).step( 0.1 ).onChange( setGeoVal );
	setGeoVal();


	function setGeoVal(){
		velVar.material.uniforms.speed.value = props.speed;
		velVar.material.uniforms.scale.value = props.scale;
		velVar.material.uniforms.slow.value = props.slow;
		velVar.material.uniforms.offsetX.value = props.offsetX;
		velVar.material.uniforms.offsetY.value = props.offsetY;
	}




	// $('#container').addClass('fadeIn');
	// $( window ).on( 'keydown', function(e){
	// 	var _keyCode = e.keyCode;
	// 	console.log( e.keyCode );
	// });

	/*	-----------------------------------------------------------------------
		

	*/


	function init()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 1600, 6400 );

		focus = new THREE.Vector3();

		//	camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 16000 );
		camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 6400 );
		camera.position.set(0, 0, 1600);
		camera.lookAt( focus );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setSize( width, height );
		document.getElementById('container').appendChild(renderer.domElement);

		//	_controls
		_controls = new THREE.OrbitControls( camera, renderer.domElement );
		_controls.autoRotate = true;
		_controls.autoRotateSpeed = 1.0;
		_controls.enableDamping = true;
		_controls.dampingFactor = 0.15;
		_controls.enableZoom = false;
		_controls.enabled = true;
		_controls.target = focus;
		// _controls.minDistance = 480;
		// _controls.maxDistance = 960;
		// _controls.minPolarAngle = 0; // radians
		// _controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians

		gpuCompute = new GPUComputationRenderer( NUM, NUM, renderer );

		var pos0 = gpuCompute.createTexture();
		var vel0 = gpuCompute.createTexture();

		fillTextures( pos0, vel0 );

		velVar = gpuCompute.addVariable( "textureVelocity", document.getElementById('computeShaderVelocity').textContent, vel0 );
		posVar = gpuCompute.addVariable( "texturePosition", document.getElementById('computeShaderPosition').textContent, pos0 );

		gpuCompute.setVariableDependencies( velVar, [ posVar, velVar ] );
		gpuCompute.setVariableDependencies( posVar, [ posVar, velVar ] );


		var error = gpuCompute.init();
		if ( error !== null ) {
		    console.error( error );
		}

		velVar.material.uniforms.time = { value: 0.0 };

		velVar.material.uniforms.speed = { value: 1000.0 };
		velVar.material.uniforms.scale = { value: 1.0 };
		velVar.material.uniforms.slow = { value: 1.0 };
		velVar.material.uniforms.offsetX = { value: 0 };
		velVar.material.uniforms.offsetY = { value: 0 };


		var PARTICLES = NUM * NUM;
		var _geometry = new THREE.BufferGeometry();

		var positions = new Float32Array( PARTICLES * 3 );
		var p = 0;
		for ( var i = 0; i < PARTICLES; i++ ) {

			positions[ p++ ] = ( Math.random() * 2 - 1 ) * 100;
			positions[ p++ ] = 0;//( Math.random() * 2 - 1 ) * 100;
			positions[ p++ ] = ( Math.random() * 2 - 1 ) * 100;
		}

		var uvs = new Float32Array( PARTICLES * 2 );
		p = 0;
		for ( var j = 0; j < NUM; j++ ) {
			for ( var i = 0; i < NUM; i++ ) {

				uvs[ p++ ] = i / ( NUM - 1 );
				uvs[ p++ ] = j / ( NUM - 1 );

			}
		}

		_geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		_geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );


		var _material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: 0.0 },
				texturePosition: { value: gpuCompute.getCurrentRenderTarget( posVar ).texture },
				textureVelocity: { value: gpuCompute.getCurrentRenderTarget( velVar ).texture }
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true,
			blending: THREE.AdditiveBlending
		});

		_mesh = new THREE.Points( _geometry, _material );
		_mesh.matrixAutoUpdate = false;
		_mesh.updateMatrix();
		scene.add( _mesh );

		// var _obj = {
		// 	num: 0
		// };
		// TweenMax.to( _obj, 30.0, { num: PARTICLES, onUpdate:function(){
		// 	_mesh.geometry.setDrawRange( 0, _obj.num );
		// }} )

		setInterval(function(){
			var _offsetX = Math.random() * 2000 - 1000;
			var _offsetY = Math.random() * 2000 - 1000;


			TweenMax.to( props, 3.0, {
				offsetX: _offsetX,
				offsetY: _offsetY,
				onUpdate: setGeoVal
			});
		}, 10 * 1000);
		

		window.onresize = resize;
	}
	function setup()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;

	}
	function update()
	{
		stats.begin();
		_animationKey = window.requestAnimationFrame( update );
		_controls.update();

		gpuCompute.compute();

		velVar.material.uniforms.time.value += 1/60;

		_mesh.material.uniforms.time.value += 1/60;
		_mesh.material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
		_mesh.material.uniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velVar ).texture;


		camera.lookAt(focus);
		renderer.render( scene, camera );
		stats.end();
	}
	function play()
	{
		update();
	}
	function stop()
	{
		window.cancelAnimationFrame( _animationKey );
	}

	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize( width, height );
		if( camera.aspect )
		{
			camera.aspect = width / height;
		} else {
			camera.left = - width * 0.5;
			camera.right = width * 0.5;
			camera.bottom = - height * 0.5;
			camera.top = height * 0.5;
		}
		
		camera.updateProjectionMatrix();
	}
	function getWorldToScreen2D( _mesh )
	{
		var vector = new THREE.Vector3();
		var widthHalf = 0.5 * renderer.context.canvas.width;
		var heightHalf = 0.5 * renderer.context.canvas.height;
		_mesh.updateMatrixWorld();
		vector.setFromMatrixPosition(_mesh.matrixWorld);
		vector.project(this.camera);
		vector.x = ( vector.x * widthHalf ) + widthHalf;
		vector.y = - ( vector.y * heightHalf ) + heightHalf;
		return { 
		    x: vector.x,
		    y: vector.y
		};
	}
	function epx( camera )
	{
		var h = window.innerHeight;
		var distance = -( h / 2 ) / Math.tan( ( camera.fov * Math.PI / 180 ) / 2 );
		return distance;
	}

	function fillTextures( texturePosition, textureVelocity ) {

		var posArray = texturePosition.image.data;
		var velArray = textureVelocity.image.data;

		for ( var k = 0, kl = posArray.length; k < kl; k += 4 ) {

			// Fill in texture values
			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			var _r = ( 1.0 - Math.random() * Math.random() ) * 100;
			posArray[ k + 0 ] = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			posArray[ k + 1 ] = Math.sin( _rad0 ) * _r;
			posArray[ k + 2 ] = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
			posArray[ k + 3 ] = 1.0;

			velArray[ k + 0 ] = ( Math.random() - .5 ) * 100;
			velArray[ k + 1 ] = ( Math.random() - .5 ) * 100;
			velArray[ k + 2 ] = ( Math.random() - .5 ) * 100;
			velArray[ k + 3 ] = 1.0;

		}

	}

})();