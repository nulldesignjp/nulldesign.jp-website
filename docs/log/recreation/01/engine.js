/*
	ENGINE.js
*/

window.onload = function()
{
	//	default
	var renderer,scene,camera,focus,light0,light1,light2,_controls;
	var _mList = [];
	var _vList = [];
	var _tmList = [];
	var _tList = [];
	var _gridScale = 8;

	init();
	setup();
	loop();

	window.onresize = resize;

	function init()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
		renderer.setClearColor(0x000000);
		renderer.setSize( width, height );
		//renderer.autoClear = false;
		document.getElementById('container').appendChild(renderer.domElement);

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 800, 3200 );

		focus = new THREE.Vector3(0,0,0);
		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3200 );
		camera.position.set(0, 0, 1000);
		camera.lookAt(focus);

		light0 = new THREE.AmbientLight( 0x333333 );
		scene.add( light0 );

		light1 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
		light1.position.set(1000,1000,1000);
		scene.add( light1 );

		light2 = new THREE.PointLight( 0xFFFFFF, 1.0, 640 );
		light2.position.set(0,0,500);
		scene.add( light2 );

		//	_controls
		_controls = new THREE.OrbitControls( camera, renderer.domElement );
		//_controls.autoRotate = true;
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

	}

	function setup()
	{
		for( var k = 0; k < _gridScale; k++ )
		{
			for( var j = 0; j < _gridScale; j++ )
			{
				for( var i = 0; i < _gridScale; i++ )
				{
					var _rad = i / _gridScale * Math.PI * 2;
					var _color = new THREE.Color( 0.5, 0.0, 0.0 ).setHSL( i / _gridScale, k/_gridScale, 0.6 );
					var _geometry = new THREE.IcosahedronGeometry( 8, 1 );
					var _material = new THREE.MeshStandardMaterial({
						color: _color,
						//shading: THREE.FlatShading,
						roughness: ( _gridScale - j ) / _gridScale,
						metalness : j / _gridScale
					});
					var _sphere = new THREE.Mesh( _geometry, _material );
					scene.add( _sphere );

					var _r = 80 + j * 25;
					_sphere.position.x = Math.cos( _rad ) * _r;
					_sphere.position.y = Math.sin( _rad ) * _r;
					_sphere.position.z = - k * 25;

					_mList.push( _sphere );
					_vList.push( new THREE.Vector3() );
					_tList.push( new THREE.Vector3(　_sphere.position.x, _sphere.position.y, _sphere.position.z ) );
				}
			}
		}

		var _grid = 24;
		var len = _mList.length;
		for( var i = 0; i < 5; i++ )
		{
			_tmList[i] = [];
			for( var j = 0; j < len; j++ )
			{
				var _x = 0;
				var _y = 0;
				var _z = 0;

				if( i == 0 )
				{
					_x = j % _gridScale * _grid;
					_y = Math.floor( j % (_gridScale*_gridScale) / _gridScale ) * _grid;
					_z = Math.floor( j / (_gridScale*_gridScale) ) * _grid;
				} else if( i == 1 ) {
					_x = Math.cos( j / len * Math.PI * 2 * 36 ) * j;
					_y = 0;
					_z = Math.sin( j / len * Math.PI * 2 * 36 ) * j;
				} else if( i == 2 ) {
					_x = ( ( j % 5 ) * 40 ) - 20;
					_y = ( - ( Math.floor( j / 5 ) % 5 ) * 40 ) + 20;
					_z = ( Math.floor( j / 25 ) ) * 40 - 1000;
				} else if( i == 3 ) {
					var phi = Math.acos( -1 + ( 2 * j ) / len );
					var theta = Math.sqrt( len * Math.PI ) * phi;
					_x = 100 * Math.cos( theta ) * Math.sin( phi );
					_y = 100 * Math.sin( theta ) * Math.sin( phi );
					_z = 100 * Math.cos( phi );

				} else if( i == 4 ) {
					var phi = j * 0.175 + Math.PI;
					_x = 100 * Math.sin( phi );
					_y = - ( j * 1 ) + 450;
					_z = 100 * Math.cos( phi );
				}

				_tmList[i][j] = new THREE.Vector3( _x, _y, _z );
			}
		}


		_tList = _tmList[ 0 ];
		setTimeout( layout, 3000 )
		
	}

	function layout()
	{
		var _layout = Math.floor( Math.random() * 5 );
		var _duration = 0.6;
		var _scale = Math.random() * 3 + 0.25;

		_tList = _tmList[ _layout ];

		var _total = _tList.length;


		var _x = scene.rotation.x;
		var _y = scene.rotation.y;
		var _z = scene.rotation.z;

		TweenMax.to(
			scene.rotation,
			_total * 0.001 + _duration,
			{
				x: _x + ( Math.random() - .5 ) * Math.PI,
				y: _y + ( Math.random() - .5 ) * Math.PI,
				z: _z + ( Math.random() - .5 ) * Math.PI
			}
		);

		setTimeout( layout, 3000 );
	}

	function loop()
	{
		var len = _mList.length;
		var _accell = 70;
		var _slow = 1.0750;

		while( len )
		{
			len --;

			var __accell = _accell + len * 0.03;
			var __slow = _slow + len * 0.0001;

			var _v = _vList[len];
			var _t = _tList[len];
			var _m = _mList[len].position;
			_v.x = ( _v.x + ( _t.x - _m.x ) / __accell ) / __slow;
			_v.y = ( _v.y + ( _t.y - _m.y ) / __accell ) / __slow;
			_v.z = ( _v.z + ( _t.z - _m.z ) / __accell ) / __slow;

			_m.x += _v.x;
			_m.y += _v.y;
			_m.z += _v.z;
		}



		camera.lookAt(focus);
		renderer.render( scene, camera );
		window.requestAnimationFrame(loop);
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
} 


