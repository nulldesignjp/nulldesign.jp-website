/*
	istworld.js
*/
var istWorld;
(function(istWorld){

	//	Mouse
	istWorld.mouse = {x:window.innerWidth*0.5,y:window.innerHeight*0.5};

	//	resolution
	istWorld.resolution = {x:window.innerWidth,y:window.innerHeight};

	//	is enable WebGL?[boolean]
	istWorld.isSupportedWebgl = function()
	{
		try {
			var canvas = document.createElement("canvas");
			return !!window["WebGLRenderingContext"] && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
		} catch (e) {
			return false;
		}
	};

	//	ZERO
	istWorld.ZERO = new THREE.Vector3(0, 0, 0);

	//	isSP
	istWorld.isSP = false;

	var three = (function(){
		function three( _dom )
		{
			//	props
			this.scene;
			this.camera;
			this.focus;
			this.renderer;

			//	init
			this.init3D( _dom );
			this.addEvents();
			this.animate();
		}
        //three.PROJECTOR = new THREE.Projector();

		three.prototype = {
			init3D	:	function( _dom )
			{
				var _width = window.innerWidth;
				var _height = window.innerHeight;
				if( istWorld.isSP )
				{
					_width *= 2;
					_height *= 2;
				}

				//	カメラ
				this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 16000 );
				//this.camera = new THREE.OrthographicCamera( _width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1000 );
				this.camera.position.z = 1000;

				//	カメラフォーカス	
				this.focus = new THREE.Vector3();
				this.focus.set( 0, 0, 0 );
				this.camera.lookAt( focus );

				//	SCENE
				this.scene = new THREE.Scene();
				this.scene.fog = new THREE.Fog( 0x000000, 4000, 16000 );

				//	renderer
				this.renderer = new THREE.WebGLRenderer( { antialias: true } );
				this.renderer.setClearColor( this.scene.fog.color, 0.1 );
				this.renderer.setSize( _width, _height );
				this.renderer.gammaInput = true;
				this.renderer.gammaOutput = true;
				this.renderer.autoClear = true;

				_dom.appendChild( this.renderer.domElement );
			},
			animate	:	function()
			{
				//requestAnimationFrame( this.animate );
				//this.render();
				var _this = this;
				setInterval(function(){
					_this.render();
				},1000/60);
			},
			render	:	function()
			{
				var _this = this;
				_this.camera.lookAt( _this.focus );
				_this.renderer.render( _this.scene, _this.camera );

				this.engine();
			},
			engine	:	function()
			{
			},
			basicLight	:	function()
			{
				this.scene.add( new THREE.AmbientLight( 0x181818 ) );
				var light = new THREE.DirectionalLight( 0x999999 );
				light.position.set( 1, 1, 1 );
				light.intensity = 1;
				this.scene.add( light );
				var light = new THREE.DirectionalLight( 0x999999 );
				light.position.set( 0, 1, 0 );
				light.intensity = 1;
				this.scene.add( light );
				var light = new THREE.DirectionalLight( 0x999999 );
				light.position.set( 1, -1, 0 );
				light.intensity = 0.5;
				this.scene.add( light );

				var light = new THREE.DirectionalLight( 0x999999 );
				light.position.set( -1, -1, -1 );
				light.intensity = 0.25;
				this.scene.add( light );
			},
			addEvents	:	function()
			{
				var _this = this;
				window.addEventListener( 'resize', function(e){
					var _width = window.innerWidth;
					var _height = window.innerHeight;
					if( istWorld.isSP )
					{
						_width *= 2;
						_height *= 2;
					}
					_this.camera.aspect = _width / _height;
					_this.camera.updateProjectionMatrix();
					_this.renderer.setSize( _width, _height );

					istWorld.resolution = {x:_width,y:_height};
				}, false );
				window.addEventListener( 'mousemove', function(e){
					e.preventDefault();
					istWorld.mouse.x = e.pageX;
					istWorld.mouse.y = e.pageY;
				}, false );
				window.addEventListener( 'touchmove', function(e){
					e.preventDefault();
					mouse.x = e.touches[0].pageX;
					mouse.y = e.touches[0].pageY;
				}, false );
			}
		}

		return three;
	})();
	istWorld.Three = three;

	var shader = (function(){
		function shader( _dom, _vid, _fid, _uniforms )
		{
			//	props
			this.scene;
			this.camera;
			this.focus;
			this.renderer;

			//
			this.vid = _vid;
			this.fid = _fid;

			_uniforms = _uniforms||{}
			this.uniforms = _uniforms;

			if( !this.uniforms.time )
			{
				this.uniforms.time = { type: "f", value: 1.0 }
			}

			//	init
			this.init3D( _dom );
			this.createScreen();
			this.addEvents();
			this.animate();
		}

		shader.prototype = {
			init3D	:	function( _dom )
			{
				var _width = window.innerWidth;
				var _height = window.innerHeight;

				//	カメラ
				this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 1, 1500 );
				this.camera.position.z = 1;

				//	カメラフォーカス	
				this.focus = new THREE.Vector3();
				this.focus.set( 0, 0, 0 );
				this.camera.lookAt( focus );

				//	SCENE
				this.scene = new THREE.Scene();
				this.scene.fog = new THREE.Fog( 0x181818, 1000, 1500 );

				//	renderer
				this.renderer = new THREE.WebGLRenderer( { antialias: false } );
				this.renderer.setClearColor( this.scene.fog.color, 1 );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.gammaInput = true;
				this.renderer.gammaOutput = true;

				_dom.appendChild( this.renderer.domElement );
			},
			createScreen	:	function()
			{
				var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
				var material = new THREE.ShaderMaterial({
					uniforms: this.uniforms,
					vertexShader: this.vid,
					fragmentShader: this.fid
					//vertexShader: document.getElementById( this.vid ).textContent,
					//fragmentShader: document.getElementById( this.fid ).textContent
				} );

				var mesh = new THREE.Mesh( geometry, material );
				this.scene.add( mesh );
			},
			animate	:	function()
			{
				//requestAnimationFrame( this.animate );
				//this.render();
				var _this = this;
				setInterval(function(){
					_this.render();
					_this.uniforms.time.value += 0.05;
				},1000/60);
			},
			render	:	function()
			{
				var _this = this;
				_this.camera.lookAt( _this.focus );
				_this.renderer.render( _this.scene, _this.camera );

				this.engine();
			},
			engine	:	function()
			{
			},
			addEvents	:	function()
			{
				var _this = this;
				window.addEventListener( 'resize', function(e){
					var _widh = window.innerWidth;
					var _height = window.innerHeight;
					if( istWorld.isSP )
					{
						_widh *= 2;
						_height *= 2;
					}
					_world.camera.aspect = _widh / _height;
					_world.camera.updateProjectionMatrix();
					_world.renderer.setSize( _widh, _height );

					istWorld.resolution = {x:_widh,y:_height};
				}, false );
				window.addEventListener( 'mousemove', function(e){
					e.preventDefault();
					istWorld.mouse.x = e.pageX;
					istWorld.mouse.y = e.pageY;
				}, false );
				window.addEventListener( 'touchmove', function(e){
					e.preventDefault();
					mouse.x = e.touches[0].pageX;
					mouse.y = e.touches[0].pageY;
				}, false );
			}
		}
		return shader;
	})();
	istWorld.Shader = shader;
})(istWorld||(istWorld={}));