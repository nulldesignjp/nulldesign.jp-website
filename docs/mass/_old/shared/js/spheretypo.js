/*
	spheretypo.js
*/

var spheretypo = (function(){

	var PI = Math.PI;

	function spheretypo(e)
	{
		this.mode = (e==undefined)?1:0;
		this.typolist = new spheretypoData().data;
		this.orderList = [];
		this.scale = 1.0;
		this.scaleVector = 0;
		this.changeKey;

		//	設定角度
		this.rotation = new THREE.Vector3(0,0,0);

		//	角速度
		this.vector = new THREE.Vector3(0,0,0);

		//	速度詳細
		this.slow = 1.075000;
		this.accell = 70;

		//	randomvcgange status
		this.changeKey;
		this.randomTimeMin = 2000;
		this.randomTimeMan = 6000;

		/*
			やってること
			vertexを生成して指定座標に配置した後にx軸とy軸をランダムに決定して回転。
			開店後の座標を正として扱う。
			vertex計算がこのブロック

		*/
		var _count = 0;
		var _geometry = new THREE.Geometry();
		for( var j in this.typolist )
		{
			var _data = this.typolist[j];
			var _typo = _data.data;

			_data.rotX = Math.random()*PI*2;
			_data.rotY = Math.random()*PI*2;
			_data.start = _geometry.vertices.length;
			_data.end = _data.start + _typo.length*2;
			_data.index = this.orderList.length;
			_data.offsetX;
			_data.offsetY;

			this.orderList.push(_data);

			var len = _typo.length;
			var _r = 80;

			var _x = 0;
			var _y = 0;
			var _xMin = 1000;
			var _yMin = 1000;
			var _xMax = -1000;
			var _yMax = -1000;
			for( var i = 0; i < len; i++ )
			{
				_xMin = _xMin > _typo[i][0]?_typo[i][0]:_xMin;
				_xMin = _xMin > _typo[i][2]?_typo[i][2]:_xMin;
				_yMin = _yMin > _typo[i][1]?_typo[i][1]:_yMin;
				_yMin = _yMin > _typo[i][3]?_typo[i][3]:_yMin;

				_xMax = _xMax < _typo[i][0]?_typo[i][0]:_xMax;
				_xMax = _xMax < _typo[i][2]?_typo[i][2]:_xMax;
				_yMax = _yMax < _typo[i][1]?_typo[i][1]:_yMax;
				_yMax = _yMax < _typo[i][3]?_typo[i][3]:_yMax;
			}

			_x = ( _xMin + _xMax ) * 0.5;
			_y = ( _yMin + _yMax ) * 0.5;

			var _rad = ( Math.random()-.5 ) * PI * .25;

			for( var i = 0; i < len; i++ )
			{
				var _dx01 = _typo[i][0] - _x + _data.offsetX;
				var _dy01 = - ( _typo[i][1] - _y ) + _data.offsetY; 
				var _dx02 = _typo[i][2] - _x + _data.offsetX;
				var _dy02 = - ( _typo[i][3] - _y ) +_data.offsetY;

					var _sin = sin( _rad );
					var _cos = cos( _rad );
					var _x0 = _cos * _dx01 - _sin * _dy01;
					var _y0 = _sin * _dx01 + _cos * _dy01;
					var _x1 = _cos * _dx02 - _sin * _dy02;
					var _y1 = _sin * _dx02 + _cos * _dy02;
					_dx01 = _x0;
					_dy01 = _y0;
					_dx02 = _x1;
					_dy02 = _y1;

				var _z = Math.sqrt( _r*_r - ( _dx01*_dx01 + _dy01*_dy01) );
				var __z = Math.random() * _z * 2 - _z;

				var _p0 = {x:_dx01,y:_dy01,z:__z};
				__z = __z + Math.random() * 10-5;
				var _p1 = {x:_dx02,y:_dy02,z:__z};


				//_data.rotY = 0;
				var _sin = sin( _data.rotY );
				var _cos = cos( _data.rotY );
				var __p0x = _cos * _p0.x - _sin * _p0.z;
				var __p0z = _sin * _p0.x + _cos * _p0.z;
				var __p1x = _cos * _p1.x - _sin * _p1.z;
				var __p1z = _sin * _p1.x + _cos * _p1.z;
				_p0.x = __p0x;
				_p0.z = __p0z;
				_p1.x = __p1x;
				_p1.z = __p1z;

				//_data.rotX = 0;
				var _sin = sin( _data.rotX );
				var _cos = cos( _data.rotX );
				var __p0y = _cos * _p0.y - _sin * _p0.z;
				var __p0z = _sin * _p0.y + _cos * _p0.z;
				var __p1y = _cos * _p1.y - _sin * _p1.z;
				var __p1z = _sin * _p1.y + _cos * _p1.z;
				_p0.y = __p0y;
				_p0.z = __p0z;
				_p1.y = __p1y;
				_p1.z = __p1z;

				_geometry.vertices.push( new THREE.Vector3( _p0.x, _p0.y, _p0.z ) );
				_geometry.vertices.push( new THREE.Vector3( _p1.x, _p1.y, _p1.z ) );

				_geometry.colors.push( new THREE.Color( 0.4, 0.4, 0.4 ) );
				_geometry.colors.push( new THREE.Color( 0.4, 0.4, 0.4 ) );
			}

		}



		//	meshの生成。
		this.container = new THREE.Object3D();
		this.containerInner = new THREE.Object3D();

		this.container.add( this.containerInner );

		var _material = new THREE.LineBasicMaterial({
			linewidth: 1,
			transparent: true,
			vertexColors: THREE.VertexColors
		});
		this.line = new THREE.Line( _geometry, _material, THREE.LinePieces );
		this.containerInner.add( this.line );

		//	賑やかしのパーティクルの生成。
		//	multiモードでは多数のsphereが出てくるため数は控えめ
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 300; i++ )
		{
			var _rad0 = Math.random() * PI*2;
			var _rad1 = Math.random() * PI*2;
			var __r = cos( _rad0 ) * _r;
			var _y = sin( _rad0 ) * _r;
			var _x = cos( _rad1 ) * __r;
			var _z = sin( _rad1 ) * __r;

			_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z);
		}
		var _material = new THREE.PointCloudMaterial({size:3,transparent:true,opacity:0.4});
		this.particle = new THREE.PointCloud( _geometry, _material );
		this.containerInner.add( this.particle );

		if( this.mode == 0 ) return;
		var _t = this;
		var _time = Math.random() * ( this.randomTimeMan - this.randomTimeMin ) + this.randomTimeMin;
		this.changeKey = setInterval(function(){	_t.changeViewRotation();	}, _time );
	}

	spheretypo.prototype = 
	{
		update:function()
		{
			var _t = this;
			// _t.vector.x = ( _t.vector.x + ( _t.rotation.x - _t.containerInner.rotation.x ) / _t.accell ) / _t.slow;
			// _t.vector.y = ( _t.vector.y + ( _t.rotation.y - _t.container.rotation.y ) / _t.accell ) / _t.slow;
			// _t.containerInner.rotation.x += _t.vector.x;
			// _t.container.rotation.y += _t.vector.y;

			_t.containerInner.rotation.x += ( _t.rotation.x - _t.containerInner.rotation.x ) * 0.1;
			_t.container.rotation.y += ( _t.rotation.y - _t.container.rotation.y ) * 0.1;


			_t.setTypo( _t.containerInner.rotation.x, _t.container.rotation.y );
		},
		changeViewRotation:function()
		{
			this.containerInner.rotation.x = (Math.random()*2-1)*PI;
			this.container.rotation.y = (Math.random()*2-1)*PI;
			this.setTypo( this.containerInner.rotation.x, this.container.rotation.y );
		},
		getTypo:function(e)
		{
			return this.typolist[e];
		},
		setTypo:function(_x,_y)
		{
			//	sphereの回転角度の設定
			this.container.rotation.y = _y;
			this.containerInner.rotation.x = _x;

		},
		setTypoColor:function(e)
		{
			//	見えるべき線もしくは点の色を強く。
			if( this.typolist[e] )
			{
				var _start = this.typolist[e].start;
				var end = this.typolist[e].end;
				var len = this.line.geometry.colors.length;
				while( len )
				{
					len = (len-1)|0;
					if( len < end && len > _start )
					{
						this.line.geometry.colors[len].r = 1.0;
						this.line.geometry.colors[len].g = 1.0;
						this.line.geometry.colors[len].b = 1.0;
					} else {
						var _color = Math.random()*Math.random()*(0.95+(1-this.mode)*.25)+.05;
						this.line.geometry.colors[len].r = random( _color );
						this.line.geometry.colors[len].g = random( _color );
						this.line.geometry.colors[len].b = random( _color );
					}
				}

				this.line.geometry.colorsNeedUpdate = true;
			}
		},
		setOpacity:function(e)
		{
			//	点と線の透明度を一括設定
			this.particle.material.transparent = true;
			this.particle.material.opacity = e;
			this.line.material.transparent = true;
			this.line.material.opacity = e;
		},
		getOpacity:function()
		{
			//	線の透明度を取得
			return this.line.material.opacity;
		},
		setOpacities:function(e0,e1)
		{
			//	点と線の透明度を個別に設定
			this.particle.material.transparent = true;
			this.particle.material.opacity = e0;
			this.line.material.transparent = true;
			this.line.material.opacity = e1;
		},
		setScale:function(e)
		{
			//	sphereのスケール設定
			this.container.scale.set(e,e,e);
		},
		getScale:function()
		{
			//	sphereのスケー取得
			return this.container.scale.x;
		},
		setPosition:function(_x,_y,_z)
		{
			//	sphereのポジション設定
			this.container.position.set(_x,_y,_z);
		},
		setRotation:function(_x,_y,_z)
		{
			//	sphereの回転角設定
			this.container.rotation.set(_x,_y,_z);
		},
		kill:function()
		{
			//	球の破壊。ぼっこーん。
			var _t = this;
			_t.containerInner.remove( _t.particle );
			_t.containerInner.remove( _t.line );
			_t.particle.geometry.dispose();
			_t.particle.material.dispose();
			_t.line.geometry.dispose();
			_t.line.material.dispose();

			_t.container.remove( _t.containerInner );
			_t.container = null;
			_t.containerInner = null;

			_t.particle = null;
			_t.line = null;
			_t.typolist = null;
			_t.orderList = null;

			clearInterval( _t.changeKey );
		}

	}

	function random( e )
	{
		return e;
	}

	function sin(e)
	{
		return Math.sin(e);
	}

	function cos(e)
	{
		return Math.cos(e);
	}

	return spheretypo;
})();