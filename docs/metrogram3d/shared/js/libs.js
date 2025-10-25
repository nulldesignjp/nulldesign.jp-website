/*
istworld.loadData.js
istworld.js
randomtypo.js
three.ndobj.js
SplineCurve.js
utils.js
*/

function round( v )
{
	return ( v * 2 | 0 ) - ( v | 0 );
}
function max( v1, v2 )
{
	return ( v1 > v2 ) ? v1 : v2;
}
function min( v1, v2 )
{
	return ( v1 < v2 ) ? v1 : v2;
}
function abs( v )
{
	return ( v ^ (v >> 31 ) ) - ( v >> 31 );
}
function floor( v )
{
	return v << 0;
}
function ciel( v )
{
	return ( v == v >> 0 ) ? v : ( v + 1 ) >> 0;
}
function sin( a )
{
	return round( Math.sin( a ) * 100000 ) * .00001;
}
function cos( a )
{
	return round( Math.cos( a ) * 100000 ) * .00001;
}
function asin( e )
{
	return Math.asin( e );
}
function scos( e )
{
	return Math.acos( e );
}
function degree2rad( e )
{
	return e * Math.PI / 180;
}
function rad2degree( e )
{
	return e * 180 / Math.PI;
}
function random()
{
	return Math.random();
}

//	Array
function shuffle( arr )
{
	var l = arr.length;
	var newArr = arr;
	while(l){
		var m = Math.floor(Math.random()*l);
		var n = newArr[--l];
		newArr[l] = newArr[m];
		newArr[m] = n;
	}
	return newArr;
}

function easeInOutSine(t,b,c,d)
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

/*
	getUA.js
*/
function getUA()
{
	var ua =
	{
		'msie'	:	false,
		'msie6'	:	false,
		'msie7'	:	false,
		'msie8'	:	false,
		'msie9'	:	false,
		'msie10'	:	false,
		'msie11'	:	false,
		'safari'	:	false,
		'firefox'	:	false,
		'chrome'	:	false,
		'opera'	:	false,

		'android'	:	false,
		'androidTablet'	:	false,

		'iphone'	:	false,
		'iphone4'	:	false,
		'iphone5'	:	false,
		'iphone6'	:	false,
		'iphone7'	:	false,
		'ipad'	:	false,
		'ipod'	:	false,
		'iphoneos5'	:	false,
		'iphoneos6'	:	false,
		'iphoneos7'	:	false,
		'iphoneos8'	:	false,
		'iphoneos9'	:	false,
		'android2.2'	:	false,
		'android2.3'	:	false,
		'android4.0'	:	false,
		'android4.1'	:	false,
		'android4.2'	:	false,
		'android4.3'	:	false,
		'android4.4'	:	false,

		'blackberry'	:	false,
		'windowsMobile'	:	false
	};
	var _ua = navigator.userAgent.toLowerCase();
	_ua = _ua.replace(/ /g, "");
	for( var i in ua )
	{
		if( _ua.indexOf( i ) != -1 )
		{
			ua[i] = true;
		}

		//	msie11
		if( i == 'msie11' )
		{
			if( _ua.indexOf( 'rv:11.0' ) != -1 )
			{
				ua[i] = true;
			}
		}
	}

	//	DEVICE
	if( ua.iphone && screen.height == 568 )
	{
		ua.iphone5 = true;
	} else {
		ua.iphone4 = true;
	}

	//	another ua....
	if( ua.android )
	{
		//	android
		ua.android = ( ( _ua.indexOf( 'android' ) != -1 && _ua.indexOf( 'mobile' ) != -1 ) && _ua.indexOf( 'sc-01c' ) == -1 )?	true:false;

		//	androidTablet:SC-01C
		ua.androidTablet = ( _ua.indexOf( 'android' ) != -1 && ( _ua.indexOf( 'mobile' ) == -1 || _ua.indexOf( 'sc-01c' ) != -1 ) )?	true:false;
	}

	//	Nexus7
	ua.isNexus7 = ( _ua.indexOf( 'nexus7' ) != -1 && ua.android );

	//	SOL23 Xperia Z1
	ua.sol23 = ( _ua.indexOf( 'sol23' ) != -1 && ua.android );

	//	SO-04D Xperia GX
	ua.so04d = ( _ua.indexOf( 'so-04d' ) != -1 && ua.android );

	//	SO-03D Xperia GX
	ua.so03d = ( _ua.indexOf( 'so-03d' ) != -1 && ua.android );


	//	windows mobile
	ua.windowsMobile = ( _ua.indexOf( 'IEMobile' ) != -1 )?	true:false;

	ua.toString = function()
	{
		return navigator.userAgent;
	}

	return ua;
}




		//	スプライン曲線の中心処理
		function SplineCurve3D(p, interpolate)
		{
			var num = p.length;
			var l = [];
			var _A = [];
			var _B = [];
			var _C = [];

			for (i=0; i < num-1; i++) {
				var p0 = p[i];
				var p1 = p[i+1];
				l[i] = Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y) + (p0.z - p1.z) * (p0.z - p1.z));
			}

			_A[0] = [0, 1, 0.5];
			_B[0] = {
				x:(3 / (2 * l[0])) * (p[1].x - p[0].x),
				y:(3 / (2 * l[0])) * (p[1].y - p[0].y),
				z:(3 / (2 * l[0])) * (p[1].z - p[0].z)
			};
			_A[num-1] = [1, 2, 0];
			_B[num-1] = {
				x:(3 / l[num - 2]) * (p[num - 1].x - p[num - 2].x),
				y:(3 / l[num - 2]) * (p[num - 1].y - p[num - 2].y),
				z:(3 / l[num - 2]) * (p[num - 1].z - p[num - 2].z)
			};

			for (i=1; i < num-1; i++) {
				var a = l[i-1];
				var b = l[i];
				_A[i] = [b, 2.0 * (b + a), a];
				_B[i] = {
					x:(3.0 * (a * a * (p[i + 1].x - p[i].x)) + 3.0 * b * b * (p[i].x - p[i - 1].x)) / (b * a),
					y:(3.0 * (a * a * (p[i + 1].y - p[i].y)) + 3.0 * b * b * (p[i].y - p[i - 1].y)) / (b * a),
					z:(3.0 * (a * a * (p[i + 1].z - p[i].z)) + 3.0 * b * b * (p[i].z - p[i - 1].z)) / (b * a)
				};
			}
			for (i=1; i < num; i++) {
				var d = _A[i-1][1] / _A[i][0];

				_A[i] = [0, _A[i][1]*d-_A[i-1][2], _A[i][2]*d];
				_B[i].x = _B[i].x * d - _B[i - 1].x;
				_B[i].y = _B[i].y * d - _B[i - 1].y;
				_B[i].z = _B[i].z * d - _B[i - 1].z;

				_A[i][2] /= _A[i][1];
				_B[i].x /= _A[i][1];
				_B[i].y /= _A[i][1];
				_B[i].z /= _A[i][1];
				_A[i][1] = 1;
			}

			_C[num-1] = {x:_B[num-1].x, y:_B[num-1].y, z:_B[num-1].z};
			for (j=num-1; j > 0; j--) {
				_C[j-1] = {
					x:_B[j - 1].x-_A[j - 1][2] * _C[j].x,
					y:_B[j - 1].y-_A[j - 1][2] * _C[j].y,
					z:_B[j - 1].z-_A[j - 1][2] * _C[j].z
				};
			}

			var out = [];
			count = 0;
			for (i=0; i < num-1; i++) {
				var a = l[i];
				var _00 = p[i].x;
				var _01 = _C[i].x;
				var _02 = (p[i + 1].x - p[i].x) * 3 / (a * a) - (_C[i + 1].x + 2 * _C[i].x) / a;
				var _03 = (p[i + 1].x - p[i].x) * (-2/(a * a * a)) + (_C[i + 1].x + _C[i].x) * (1 / (a * a));

				var _10 = p[i].y;
				var _11 = _C[i].y;
				var _12 = (p[i + 1].y - p[i].y) * 3 / (a * a) - (_C[i + 1].y + 2 * _C[i].y) / a;
				var _13 = (p[i + 1].y - p[i].y) * (-2/(a * a * a)) + (_C[i + 1].y + _C[i].y) * (1 / (a * a));

				var _20 = p[i].z;
				var _21 = _C[i].z;
				var _22 = (p[i + 1].z - p[i].z) * 3 / (a * a) - (_C[i + 1].z + 2 * _C[i].z) / a;
				var _23 = (p[i + 1].z - p[i].z) * (-2/(a * a * a)) + (_C[i + 1].z + _C[i].z) * (1 / (a * a));

				var t = 0;
				for (j=0; j < interpolate; j++) {
					out[count] = {
						x:((_03 * t + _02) * t + _01) * t + _00,
						y:((_13 * t + _12) * t + _11) * t + _10,
						z:((_23 * t + _22) * t + _21) * t + _20
					};
					count++;
					t += a / interpolate;
				}
			}
			out[count] = {
				x:p[num-1].x,
				y:p[num-1].y,
				z:p[num-1].z
			};

			return out;
		}


		//	スプライン曲線の中心処理
		function SplineCurve(p, interpolate)
		{
			var num = p.length;
			var l = [];
			var _A = [];
			var _B = [];
			var _C = [];

			for (i=0; i < num-1; i++) {
				var p0 = p[i];
				var p1 = p[i+1];
				l[i] = Math.sqrt((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y));
			}

			_A[0] = [0, 1, 0.5];
			_B[0] = {
				x:(3 / (2 * l[0])) * (p[1].x - p[0].x),
				y:(3 / (2 * l[0])) * (p[1].y - p[0].y)
			};
			_A[num-1] = [1, 2, 0];
			_B[num-1] = {
				x:(3 / l[num - 2]) * (p[num - 1].x - p[num - 2].x),
				y:(3 / l[num - 2]) * (p[num - 1].y - p[num - 2].y)
			};

			for (i=1; i < num-1; i++) {
				var a = l[i-1];
				var b = l[i];
				_A[i] = [b, 2.0 * (b + a), a];
				_B[i] = {
					x:(3.0 * (a * a * (p[i + 1].x - p[i].x)) + 3.0 * b * b * (p[i].x - p[i - 1].x)) / (b * a),
					y:(3.0 * (a * a * (p[i + 1].y - p[i].y)) + 3.0 * b * b * (p[i].y - p[i - 1].y)) / (b * a)
				};
			}
			for (i=1; i < num; i++) {
				var d = _A[i-1][1] / _A[i][0];

				_A[i] = [0, _A[i][1]*d-_A[i-1][2], _A[i][2]*d];
				_B[i].x = _B[i].x * d - _B[i - 1].x;
				_B[i].y = _B[i].y * d - _B[i - 1].y;

				_A[i][2] /= _A[i][1];
				_B[i].x /= _A[i][1];
				_B[i].y /= _A[i][1];
				_A[i][1] = 1;
			}

			_C[num-1] = {x:_B[num-1].x, y:_B[num-1].y};
			for (j=num-1; j > 0; j--) {
				_C[j-1] = {
					x:_B[j - 1].x-_A[j - 1][2] * _C[j].x,
					y:_B[j - 1].y-_A[j - 1][2] * _C[j].y
				};
			}

			var out = [];
			count = 0;
			for (i=0; i < num-1; i++) {
				var a = l[i];
				var _00 = p[i].x;
				var _01 = _C[i].x;
				var _02 = (p[i + 1].x - p[i].x) * 3 / (a * a) - (_C[i + 1].x + 2 * _C[i].x) / a;
				var _03 = (p[i + 1].x - p[i].x) * (-2/(a * a * a)) + (_C[i + 1].x + _C[i].x) * (1 / (a * a));
				var _10 = p[i].y;
				var _11 = _C[i].y;
				var _12 = (p[i + 1].y - p[i].y) * 3 / (a * a) - (_C[i + 1].y + 2 * _C[i].y) / a;
				var _13 = (p[i + 1].y - p[i].y) * (-2/(a * a * a)) + (_C[i + 1].y + _C[i].y) * (1 / (a * a));

				var t = 0;
				for (j=0; j < interpolate; j++) {
					out[count] = {
						x:((_03 * t + _02) * t + _01) * t + _00,
						y:((_13 * t + _12) * t + _11) * t + _10
					};
					count++;
					t += a / interpolate;
				}
			}
			out[count] = {
				x:p[num-1].x,
				y:p[num-1].y
			};

			return out;
		}

var THREE = THREE||{};
(function(ndobj){
	ndobj.createPipe = (function(){
		var main = function(){
			var _r = 4;
			var _length = 30;
			var _weight = 1;
			var points = [
				new THREE.Vector3( _r, 0, _length * 0.5 ),
				new THREE.Vector3( _r + _weight, 0, _length * 0.5 ),
				new THREE.Vector3( _r + _weight, 0, -_length * 0.5 ),
				new THREE.Vector3( _r, 0, -_length * 0.5 )
			];
			var geometry = new THREE.LatheGeometry( points );
			var material = new THREE.MeshLambertMaterial(
				{
					shading: THREE.NoShading,
					side:THREE.DoubleSide,
					color: 0xCCCCCC,
					wireframe:false,
					blending:THREE.AdditiveBlending
				});
			var _pipe = new THREE.Mesh( geometry, material );
			return _pipe;
		}
		return main;
	})();

	ndobj.createTrain = (function(){
		var main = function()
		{
			var geometry = new THREE.BoxGeometry( 6, 6, 30, 1, 1, 1 );
			var material = new THREE.MeshLambertMaterial({
					shading: THREE.NoShading,
					color: 0xCC0000,
					wireframe:false,
					blending:THREE.AdditiveBlending
			});
			var _train = new THREE.Mesh( geometry, material );
			return _train;
		}
		return main;
	})();

	ndobj.createLine = (function(){
		var main = function( e )
		{
			var geometry = new THREE.Geometry();
			geometry.vertices = e;
			var material = new THREE.LineBasicMaterial({
				color: 0xFFFFFF,
				linewidth: 1,
				transparent: true,
				opacity: 0.6
			});
			var _line = new THREE.Line( geometry, material );
			return _line;
		}
		return main;
	})();

	ndobj.createRail = (function(){
		var main = function()
		{
/*			var _scale = 1.0;
			var _map = THREE.ImageUtils.loadTexture('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAeCAYAAACWuCNnAAABQklEQVR4Ae3cwQ2CUBAE0I8VWIKV2ButWYkl2IG6V74HvJCd8LhpOKxvJyNKwhgOAgQIECBAgAABAgQIEDipwPLrc99v1/f2/cfzNZ3rvDG4jCEHclB9cUQOLtti8poAAQJdBRRW182YiwCBSWBZ13X6+Ted5Q0CBAg0EHCF1WAJRiBAYJ+Awtrn5CwCBBoITHf+aqYj/u13d41zZU0O5OCfHLjCKi0HAQIRAgorYk2GJECgBBSWHBAgECOgsGJWZVACBBSWDBAgECOgsGJWZVACBBSWDBAgECOgsGJWZVACBBSWDBAgECOgsGJWZVACBBSWDBAgECPg8TIxqzIoAQKusGSAAIEYAYUVsyqDEiDg8TLfDHicjse8VBXIQf8cuMLypUWAQIyAwopZlUEJECBAgAABAgQIECBAgAABAqcV+ACQp2WGFovVrwAAAABJRU5ErkJggg==')
			_map.wrapS = THREE.RepeatWrapping;
			_map.wrapT = THREE.RepeatWrapping;
			_map.repeat.set( _scale, 1.0 );

			var _map01 = new THREE.MeshLambertMaterial({color:0xFFFFFF,map:_map,transparent:true})
			var _map00 = new THREE.MeshLambertMaterial({color:0x666666});
			var materials = [ _map00, _map00, _map01, _map00, _map00, _map00 ];
			var material = new THREE.MeshFaceMaterial(materials);
			var geometry = new THREE.BoxGeometry(120,0.5,12,1,1,1);
			var _rail = new THREE.Mesh( geometry, material );
			_rail.position.y = -50;
			return _rail;*/

			var geometry = new THREE.BoxGeometry(8,0.5,120,1,1,1);
			var material = new THREE.MeshLambertMaterial({color:0x666666});
			var _rail = new THREE.Mesh( geometry, material );
			return _rail;
		}
		return main;
	})();

	ndobj.randomPlane = (function(){
		var main = function( _w0, _h0, _w1, _h1, size )
		{
			var geometry = new THREE.PlaneGeometry( _w0, _h0, _w1, _h1 );

			var len = geometry.vertices.length;
			for( var i = 0; i < len; i++ )
			{
				geometry.vertices[i].z = Math.random() * size - size * 0.5;
			}

			geometry.computeFaceNormals();
			geometry.computeVertexNormals();

			var material = new THREE.MeshLambertMaterial({color:0x666666,shading:THREE.NoShading});
			var _plane = new THREE.Mesh( geometry, material );
			return _plane;
		}
		return main;
	})();

})(THREE.ndobj||(THREE.ndobj={}))



/*
	randomtypo.js
*/

var randomtypo = (function(){
	var _randomtypo = function( _dom, _text, _delay )
	{
		this.dom = _dom;
		this.text = _text;
		this.intevalKey;
		this.count = 0;
		this.delay = _delay

		// var _this = this;
		// this.dom.on('mouseover', function(){
		// 	_this.start()
		// })
	}
	_randomtypo.text = '_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	_randomtypo.fps = 60;

	_randomtypo.prototype = 
	{
		start	:	function()
		{
			if( istWorld.isSP )
			{
				var _str = this.text;
				this.dom.text( _str );
				return;
			}
			this._start();
		},
		_draw	:	function()
		{
			var _this = this;
			this.intevalKey = window.requestAnimationFrame( function(){ _this._draw();	});
			var len = this.text.length;
			var _str = '';

			if( len == 0 )
			{
				_str = this.text;
				this._fixed();
				return;
			}

			var _delay = _randomtypo.fps * ( this.delay / 1000 );
			var _strCount = Math.floor( ( this.count - _delay ) * 0.25 );
			_strCount = _strCount<0?0:_strCount;

			if( len < _strCount )
			{
				_str = this.text;
				this._fixed();
				return;
			} else {
				_str = this.text.substr( 0, _strCount );

				var len2 = len - _strCount;

				for( var i = 0; i < len2; i++ )
				{
					_str += _randomtypo.text.charAt( Math.floor( Math.random() * _randomtypo.text.length ) );
				}
			}

			this.dom.text( _str );

			this.count ++;
		},
		_fixed	:	function()
		{
			var _this = this;
			window.cancelAnimationFrame( _this.intevalKey );
			_this.count = 0;
		},
		_start	:	function()
		{
			var _this = this;
			window.cancelAnimationFrame( _this.intevalKey );
			_this._draw();
		},
		_restart	:	function()
		{
			this.count = 0;
			this._start();
		},
		setText	:	function( _text )
		{
			this.text = _text;
		}
	};
	return _randomtypo;
})();


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


var istWorld = istWorld||{};
istWorld.loadData = (function(){

	function main( _xml , _world )
	{
		this.xml = _xml;
		this.world = _world;


		this.lineList = {};
		this.stationList = {};
		this.stations = {};
		this.panelList = [];

		this.total = [];
	}

	main.prototype = {
		load	:	function( _callback )
		{
			var _this = this;
			var url = this.xml;
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'XML',
				success: _success,
				error: _error
			});

			function _success( _xml )
			{

				var _loader = new THREE.ImageUtils.loadTexture(
					"shared/img/spark1.png",
					THREE.UVMapping,
					function(_texture){
						var attributes = {
							size: {	type: 'f', value: [] },
							customColor: { type: 'c', value: [] }

						};

						var uniforms = {
							amplitude: { type: "f", value: 1.0 },
							color:     { type: "c", value: new THREE.Color( 0xffffff ) },
							texture:   { type: "t", value: _texture },
						};

						var shaderMaterial = new THREE.ShaderMaterial( {
							uniforms:       uniforms,
							attributes:     attributes,
							vertexShader:   document.getElementById( 'vertexshader' ).textContent,
							fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

							blending:       THREE.AdditiveBlending,
							depthTest:      false,
							transparent:    true,

							//sizeAttenuation: false
						});
						
						var _stationParticle = new THREE.Geometry();

						var vertices = _stationParticle.vertices;
						var values_size = attributes.size.value;
						var values_color = attributes.customColor.value;

						$( _xml ).find('stations line').each(function(){

							var _id = $( this ).attr('id');
							var _name = $( this ).attr('name');
							var _color = parseInt( '0x' + $( this ).attr('color'),16 );

							var _lineParticle = new THREE.Geometry();
							var _rlist = [];
							var _colors = [];

							$( this ).find('item').each(function(){
								var __id = $( this ).attr('id');
								var _x = parseFloat( $( this ).find('location longitude').text() );
								var _y = 0;
								var _z = parseFloat( $( this ).find('location latitude').text() );
								var _e = $( this ).find('english').text();

								_x = istWorld.roundValue( _x );
								_y = istWorld.roundValue( _y );

								//	座標	
								_x = ( _x - istWorld.offsetLng ) * istWorld.zoom;
								_y = $( this ).find('depth').text() * istWorld.hPar;
								_z = - ( _z - istWorld.offsetLat ) * istWorld.zoom;

								if( !_this.stations[_id] )
								{
									_this.stations[_id] = {}
									_this.stations[_id].id = __id;
									_this.stations[_id].name = _name;
									_this.stations[_id].english = _e;
									_this.stations[_id].color = _color;
									_this.stations[_id].data = [];
								}

								//	vertex
								var vector = new THREE.Vector3( _x, _y, _z );

								//	line points
								_lineParticle.vertices.push( vector );

								//	station color
								_colors.push( new THREE.Color( _color ) );
								_stationParticle.vertices.push( vector );

								var _name = $( this ).find('name').eq(0).text();
								var _ename = $( this ).find('english').eq(0).text();
								_rlist.push( {name:_name,english:_ename,x:_x,y:_y,z:_z} );

								values_size.push( 0 );
								values_color.push( new THREE.Color( _color ) )

							});

							_lineParticle.colors = _colors;

							//	line core
							var geometry = new THREE.Geometry();
							var _list = SplineCurve3D( _lineParticle.vertices, istWorld.div );
							geometry.vertices = _list;
							var material = new THREE.LineBasicMaterial({color:_color,transparent:true,opacity:0.4,linecap:'round',linejoin:'round'});
							var _line = new THREE.Line( geometry, material );
							_this.world.scene.add( _line );

							_this.stations[_id].data = _line.geometry.vertices;

							//	wrapper
							if( !istWorld.isSP )
							{
								var material = new THREE.LineBasicMaterial({linewidth:8,color:0xFFFFFF,transparent:true,opacity:0.1,blending:THREE.AdditiveBlending});
								var line = new THREE.Line( geometry, material );
								_this.world.scene.add( line );

								var material = new THREE.LineBasicMaterial({linewidth:2,color:0xFFFFFF,transparent:true,opacity:0.1,blending:THREE.AdditiveBlending});
								var line = new THREE.Line( geometry, material );
								_this.world.scene.add( line );
							}
							
							//	schdule data
							var _data = {};
							_data.id = $( this ).attr('id');
							_data.color = parseInt( '0x' + $( this ).attr('color'),16 );
							_data.name = $( this ).attr('name');
							_data.rlist = _rlist;
							_data.dlist = [];
							_data.dlist[0] = _list;
							_data.dlist[1] = SplineCurve3D( _lineParticle.vertices, istWorld.div ).reverse();
							_data.schdule = _schdule[ $( this ).attr('id') ];
							_data.pointerlist = [];
							_data.pointerlist[0] = [];
							_data.pointerlist[1] = [];
							_data.object = line;

							//	_this.total = _this.total.concat( _list );

							var _lineData = {};
							_lineData.name = _name;
							_lineData.english = _id;
							_lineData.object = _line;
							_lineData.data = [	_data.dlist[0],	_data.dlist[1]	];
							_lineData.stationName = _rlist;
							_this.total.push( _lineData );

							var len = _data.schdule.length;
							for( var i = 0; i < len; i++ )
							{
								var len1 = _data.schdule[i].length;
								for( var j = 0; j < len1; j++ )
								{
									_data.pointerlist[i][j] = 0;
									var len2 = _data.schdule[0][i].length;
									for( var k = 0; k < len2; k++ )
									{
										if( _data.schdule[i][j][k] != '-' )
										{
											var _t = _data.schdule[i][j][k].split(':');
											var _h = parseInt( _t[0] );
											var _m = parseInt( _t[1] );
											var _time = _h * 60 + _m;
											_data.schdule[i][j][k] = _time;
										}
									}
								}
							}
							_this.lineList[_data.id] = _data;

							//	fix
						});

						//	stations
						var particles = new THREE.PointCloud( _stationParticle, shaderMaterial );
						_this.world.scene.add(particles);

						//	ぽわぽわ
						setInterval(function(){
							var time = Date.now() * 0.001;
							var len = attributes.size.value.length
							for( var i = 0; i < len; i++ )
							{
								attributes.size.value[ i ] = 60 + 30 * Math.sin( 0.5 * i + time );
							}
							attributes.size.needsUpdate = true;
						},1000/60)

						//	pseudo return
						_callback();
					},
					undefined
				);
		
			}
			function _error( meg ){}
		}
	};
	return main;
})();