/*
	app.js
*/
window.addEventListener("load", function (){

	//	
	var _ua = getUA();
	istWorld.isSP = _ua.iphone||_ua.android||_ua.ipod?true:false;
	if( istWorld.isSP  )
	{
		$('body').addClass('sp');
		$('strst').css('display','none');
	}

	istWorld.roundValue = function( e )
	{
		return floor( e * 10000 ) * 0.0001;
	}

	//	pro
	istWorld.zoom = 50000;
	istWorld.hPar = 24.0;
	istWorld.offsetLat = istWorld.roundValue( 35.68251450 );
	istWorld.offsetLng = istWorld.roundValue( 139.76614850 );

	istWorld.div = 60;

	//	lists
	istWorld.lineList = {};
	istWorld.stationList = {};
	istWorld.stations = {};
	istWorld.panelList = [];
	istWorld.total = [];

	//
	istWorld.dist = 300;
	istWorld.viewLength = 400;;

	istWorld.trainObject;
	istWorld.trainList = [];
	istWorld.trainStock = [];

	//
	istWorld.attributes;
	istWorld.uniforms;
	istWorld.attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] }
	};
	istWorld.uniforms = {
		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		scale:     { type: "f", value: 1.0 },
		texture:   { type: "t", value: null },
	};

	istWorld.trainSize = 24;

	//	graphics.env
	istWorld.worldStartTime = '04:55';
	istWorld.speedRate = 0.04;
	istWorld.frameCount = ( parseInt( istWorld.worldStartTime.split(':')[0] ) * 60 + parseInt( istWorld.worldStartTime.split(':')[1] ) ) / istWorld.speedRate;
	istWorld.timeCount = 0;
	istWorld.timeChecker = false;
	istWorld.resetTime = istWorld.frameCount;

	istWorld.adj = 0;
	istWorld.mode = 2;
	istWorld.targetLine = {};
	istWorld.currentLine = [];
	istWorld.lineDir = 0;
	istWorld.lineStList = [];

	istWorld.changeViewKey;

	$('#timer').text(istWorld.worldStartTime+':00');

	//	loading effect
	var _progress = $('<div>').addClass('progressArea00');
	var _loading = $('<div>').addClass('loading');
	$( _progress ).append( _loading );
	$('body').append(_progress);

	$('#btnAbout').on('click',function(){
		$('#about').addClass('show');
	}).attr('href','javascript:void(0)');
	$('#about').on('click',function(){
		$('#about').removeClass('show');
	})

	//	no support
	var canvas = document.createElement("canvas");
	var _check01 = ( window["WebGLRenderingContext"] );
	var _check02 = ( (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) );
	
	if( _check01 != null && _check02 != null )
	{
		//	support bro
	} else {
		//	no support bro
		$( _progress ).addClass('fadeOut');
		$('#stationInfo').css('display','none');
		var _p = $('<p>').addClass('nosupport');
		_p.text('Your Browser Does Not Support WebGL.');
		$('#siteBody').append( _p );

		setTimeout( function(){
			$( _progress ).remove();
			_progress = null;
			_loading = null;
		}, 2000 );
		setTimeout( function(){
			$('#siteBody').addClass('open');
		}, 1000 );

		setTimeout( function(){
			$('#snsBlock01').addClass('snsFillIn');
		},2000);
		
		return;
	}

	//	world
	var _dom = document.getElementById('siteBody');
	var _world = new istWorld.Three( _dom );
	_world.camera.position.set( 0, 10, 1000 );
	_world.renderer.antialias = true;
	_world.engine = engine;
	var mouse = istWorld.mouse;
	
	//	init
	_world.camera.position.set( 0, 2000 + floor( random() * 5 ) * 1000, 1 );
	_world.focus.set( 0, 0, 0 );

	//
	var _loader = new THREE.ImageUtils.loadTexture(
		"shared/img/spark1.png",
		THREE.UVMapping,
		function(_texture){
			istWorld.uniforms.texture.value = _texture;
			createTrainObject();
			start();
		},
		undefined
	);

	//	start
	function start()
	{
		setTimeout(loadXML,1200);
		clearTimeout( istWorld.changeViewKey );
		istWorld.changeViewKey = setTimeout( changeview00, 8000 );
	}

	function changeview00()
	{
		$('#strjp').text('');
		$('#stren').text('');
		$('#strst').text('');

		var _modeList = [
			mode00,
			mode01,
			mode01,
			mode01,
			mode02,
			mode02,
			mode03,
			mode03,
			mode03,
			mode04,
			mode04,
			mode04
		];


		istWorld.uniforms.scale.value = 1.0;
		_world.camera.fov = 35;

		var _screenSizeScale = ( istWorld.resolution.x * istWorld.resolution.y ) / ( 1024 * 768 );


		var _mode = floor( random() * _modeList.length );
		_modeList[ _mode ]();

		_world.camera.updateProjectionMatrix();

		function mode00()
		{
			//	static
			istWorld.mode = 0;
			istWorld.uniforms.scale.value = 1.0 * _screenSizeScale;
			istWorld.viewLength = random() * 1200 + 400;
			changeView01();
		}

		function mode01()
		{
			//	line view
			istWorld.mode = 1;
			istWorld.uniforms.scale.value = 2.0 * _screenSizeScale;
			istWorld.tpoint = 0;

			istWorld.lineDir = 0;
			istWorld.lineStList = [];

			var len = istWorld.total.length;
			var _no = floor( random() * len );
			istWorld.targetLine = istWorld.total[ _no ];

			istWorld.lineDir = floor( random() * istWorld.targetLine.data.length );
			istWorld.currentLine = istWorld.targetLine.data[ istWorld.lineDir ];

			istWorld.lineStList = istWorld.lineDir==0?istWorld.targetLine.stationName:istWorld.targetLine.stationName.reverse();

			var _randomtypo0 = new randomtypo( $('#strjp'), istWorld.targetLine.name, 0 );
			_randomtypo0.start();

			var _randomtypo1 = new randomtypo( $('#stren'), istWorld.targetLine.english + ' Line.', 0 );
			_randomtypo1.start();

			//	lines
			hideLine();
			showLine(_no);
		}

		function mode02()
		{
			//	topview
			istWorld.mode = 2;
			istWorld.uniforms.scale.value = 0.5 * _screenSizeScale;

			var _l = [];
			for( var i in istWorld.lineList )
			{
				_l.push( istWorld.lineList[i] );
			}

			var num = floor( random() * _l.length );
			var _sta = _l[num];

			var len = _sta.rlist.length;
			var num = floor( random() * len );

			_sta = _sta.rlist[num];
			var _randomtypo0 = new randomtypo( $('#strjp'), _sta.name, 0 );
			_randomtypo0.start();

			var _randomtypo1 = new randomtypo( $('#stren'), _sta.english, 0 );
			_randomtypo1.start();

			_world.camera.position.set( _sta.x, 2000 + floor( random() * 5 ) * 1000, _sta.z + 1 );
			_world.focus.set( _sta.x, _sta.y, _sta.z );

			clearTimeout( istWorld.changeViewKey );
			istWorld.changeViewKey = setTimeout( changeview00, 5000 );
		}

		function mode03()
		{
			//	超ふかn
			istWorld.mode = 3;
			istWorld.uniforms.scale.value = 1.5 * _screenSizeScale;
			istWorld.viewLength = 6000;

			var _randomtypo0 = new randomtypo( $('#strjp'), 'metrogram3D', 0 );
			_randomtypo0.start();

			var _randomtypo1 = new randomtypo( $('#stren'), '', 0 );
			_randomtypo1.start();
			clearTimeout( istWorld.changeViewKey );
			istWorld.changeViewKey = setTimeout( changeview00, 9000 );
		}

		function mode04()
		{
			//	line view2
			istWorld.mode = 4;
			istWorld.uniforms.scale.value = 0.5 * _screenSizeScale;
			istWorld.tpoint = 0;
			istWorld.viewLength = 500 + random() * 2500;

			istWorld.lineDir = 0;
			istWorld.lineStList = [];

			var len = istWorld.total.length;
			var _no = floor( random() * len );
			istWorld.targetLine = istWorld.total[ _no ];

			istWorld.lineDir = floor( random() * istWorld.targetLine.data.length );
			istWorld.currentLine = istWorld.targetLine.data[ istWorld.lineDir ];

			istWorld.lineStList = istWorld.lineDir==0?istWorld.targetLine.stationName:istWorld.targetLine.stationName.reverse();

			var _randomtypo0 = new randomtypo( $('#strjp'), istWorld.targetLine.name, 0 );
			_randomtypo0.start();

			var _randomtypo1 = new randomtypo( $('#stren'), istWorld.targetLine.english + ' Line.', 0 );
			_randomtypo1.start();

			_world.camera.fov = 90;

			//	lines
			hideLine();
			showLine(_no);
		}
	}

	function changeView01()
	{
		var _l = [];
		for( var i in istWorld.lineList )
		{
			_l.push( istWorld.lineList[i] );
		}

		var num = floor( random() * _l.length );
		var _sta = _l[num];

		var len = _sta.rlist.length;
		var num = floor( random() * len );

		_sta = _sta.rlist[num];
		var _randomtypo0 = new randomtypo( $('#strjp'), _sta.name, 0 );
		_randomtypo0.start();

		var _randomtypo1 = new randomtypo( $('#stren'), _sta.english, 0 );
		_randomtypo1.start();

		var _sc = 0;
		var _duration = 180;
		var _sx = _world.focus.x;
		var _sy = _world.focus.y;
		var _sz = _world.focus.z;

		var _sr = istWorld.adj + random() * Math.PI * 2 - Math.PI;


		_pseudoRender();

		function _pseudoRender()
		{
			_world.focus.x = easeInOutSine(_sc , _sx, _sta.x - _sx,_duration);
			_world.focus.y = easeInOutSine(_sc , _sy, _sta.y - _sy,_duration);
			_world.focus.z = easeInOutSine(_sc , _sz, _sta.z - _sz,_duration);

			istWorld.adj = easeInOutSine(_sc , istWorld.adj, _sr - istWorld.adj ,_duration)
			_world.camera.lookAt( _world.focus );

			if( _sc >= _duration )
			{
				_world.focus.set( _sta.x, _sta.y, _sta.z );
				_world.camera.lookAt( _world.focus );

				clearTimeout( istWorld.changeViewKey );
				istWorld.changeViewKey = setTimeout( changeview00, 5000 );
			} else {
				requestAnimationFrame( _pseudoRender );
			}

			_sc ++;
		}
	}

	function showLine( e )
	{
		istWorld.total[e].object.material.opacity = 0.6;
		istWorld.total[e].object.material.linewidth = 8;
	}

	function showAllLine()
	{
		var len = istWorld.total.length;
		for( var i = 0; i < len; i++ )
		{
			istWorld.total[i].object.material.opacity = 0.4;
			istWorld.total[i].object.material.linewidth = 1;
		}
	}

	function hideLine()
	{
		var len = istWorld.total.length;
		for( var i = 0; i < len; i++ )
		{
			istWorld.total[i].object.material.opacity = 0.1;
			istWorld.total[i].object.material.linewidth = 0.5;
		}
	}

	//	create
	function createTrainObject()
	{
		//	train stock
		var shaderMaterial = new THREE.ShaderMaterial( {
			uniforms:       istWorld.uniforms,
			attributes:     istWorld.attributes,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			blending:       THREE.AdditiveBlending,
			depthTest:      false,
			transparent:    true
		});
		var geometry = new THREE.Geometry();
		for( var i = 0; i < 1200; i++ )
		{
			var _train = createTrain();
			istWorld.trainStock[i] = _train;
			geometry.vertices[i] = new THREE.Vector3( random() * 12000 - 6000, 0, random() * 12000 - 6000 );
		}
		istWorld.trainObject = new THREE.PointCloud( geometry, shaderMaterial );
		_world.scene.add( istWorld.trainObject );
		_world.render();

		//	bug
		var len = geometry.vertices.length;
		while( len )
		{
			len--;
			geometry.vertices[len].x = 0;
			geometry.vertices[len].y = 10000;
			geometry.vertices[len].z = 0;
		}
		istWorld.trainObject.geometry.verticesNeedUpdate = true;
	}
	function createTrain()
	{
		var values_size = istWorld.attributes.size.value;
		var values_color = istWorld.attributes.customColor.value;

		var _no = values_size.length;
		values_size.push( istWorld.trainSize );
		values_color.push( new THREE.Color( 0xFFFFFF ) );
		return { 'no': _no };
	}

	function loadXML()
	{
		var _data = new istWorld.loadData( 'shared/data/stationlist.xml' + '?cache=v0' + Date.now(), _world );
		_data.load( _callback );
		function _callback()
		{
			$( _progress ).addClass('fadeOut');
			setTimeout( function(){
				$( _progress ).remove();
				_progress = null;
				_loading = null;
			}, 2000 );
			setTimeout( function(){
				animate();
				$('#siteBody').addClass('open');
			}, 1000 );

			//	not cool....
			istWorld.lineList = _data.lineList;
			istWorld.stations = _data.stations;
			istWorld.panelList = _data.panelList;
			istWorld.total = _data.total;

			setTimeout( function(){
				$('#snsBlock01').addClass('snsFillIn');
			},2000)
		}
	}
	function animate()
	{
		requestAnimationFrame( animate );
		loop();
	}
	function loop()
	{
		var _time = Date.now() * 0.0025;
		istWorld.frameCount ++;
		
		if( istWorld.mode == 0 )
		{
			var _rad = istWorld.frameCount * 0.01 / 180 * Math.PI + istWorld.adj;
			_world.camera.position.x = cos( _rad ) * istWorld.viewLength + _world.focus.x;
			_world.camera.position.y = sin( _rad ) * 100 + _world.focus.y;
			_world.camera.position.z = sin( _rad ) * istWorld.viewLength + _world.focus.z;
		} else if( istWorld.mode == 1 )
		{
			if( istWorld.tpoint % istWorld.div == 0 )
			{
				var _no = floor( istWorld.tpoint / istWorld.div );

				if( _no < istWorld.lineStList.length - 1 )
				{
					var _name = istWorld.lineStList[_no].name;
					var _randomtypo1 = new randomtypo( $('#strst'), _name, 0 );
					_randomtypo1.start();
				}
			}


			istWorld.tpoint ++;

			if( istWorld.tpoint >= istWorld.currentLine.length )
			{
				showAllLine();
				changeview00();
				return;
			}

			var _speed = 0.1;
			_world.focus.x += ( istWorld.currentLine[istWorld.tpoint].x - _world.focus.x ) * _speed * 2;
			_world.focus.y += ( istWorld.currentLine[istWorld.tpoint].y - _world.focus.y ) * _speed * 2;
			_world.focus.z += ( istWorld.currentLine[istWorld.tpoint].z - _world.focus.z ) * _speed * 2;

			var _dist = istWorld.dist;
			var _dx = _world.focus.x - _world.camera.position.x;
			var _dy = _world.focus.y - _world.camera.position.y;
			var _dz = _world.focus.z - _world.camera.position.z;
			var _d = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
			var _pow = _d - _dist;
			var _par = _pow / ( _dist - _d );
			_dx = _pow * _dx / _d;
			_dy = _pow * _dy / _d;
			_dz = _pow * _dz / _d;

			var target = {}
			target.x = _world.camera.position.x + _dx;
			target.y = _world.camera.position.y + _dy;
			target.z = _world.camera.position.z + _dz;

			_world.camera.position.x += ( target.x - _world.camera.position.x ) * _speed;
			_world.camera.position.y += ( target.y - _world.camera.position.y ) * _speed;
			_world.camera.position.z += ( target.z - _world.camera.position.z ) * _speed;
		} else if( istWorld.mode == 3 )
		{
			var _rad = istWorld.frameCount * 0.05 / 180 * Math.PI + istWorld.adj;
			var _target = {};
			_target.x = cos( _rad ) * istWorld.viewLength + _world.focus.x;
			_target.y = istWorld.viewLength * 0.5 + sin( _rad ) * 3000 + _world.focus.y;
			_target.z = sin( _rad ) * istWorld.viewLength + _world.focus.z;
			_world.camera.position.x += ( _target.x - _world.camera.position.x ) * 0.02;
			_world.camera.position.y += ( _target.y - _world.camera.position.y ) * 0.02;
			_world.camera.position.z += ( _target.z - _world.camera.position.z ) * 0.02;
		} else if( istWorld.mode == 4 )
		{

			if( istWorld.tpoint % istWorld.div == 0 )
			{
				var _no = floor( istWorld.tpoint / istWorld.div );

				if( _no < istWorld.lineStList.length - 1 )
				{
					var _name = istWorld.lineStList[_no].name;
					var _randomtypo1 = new randomtypo( $('#strst'), _name, 0 );
					_randomtypo1.start();
				}
			}


			istWorld.tpoint ++;

			if( istWorld.tpoint >= istWorld.currentLine.length )
			{
				showAllLine();
				changeview00();
				return;
			}

			var _speed = 0.1;
			_world.focus.x += ( istWorld.currentLine[istWorld.tpoint].x - _world.focus.x ) * _speed * 2;
			_world.focus.y += ( istWorld.currentLine[istWorld.tpoint].y - _world.focus.y ) * _speed * 2;
			_world.focus.z += ( istWorld.currentLine[istWorld.tpoint].z - _world.focus.z ) * _speed * 2;

			_world.camera.position.x = _world.focus.x;
			_world.camera.position.y = istWorld.viewLength;
			_world.camera.position.z = _world.focus.z + 1;
		}

		_loop00();
	}
	var _past = 0;
	function _loop00()
	{
		istWorld.timeCount = floor( istWorld.frameCount * istWorld.speedRate );
		istWorld.timeChecker = _past==istWorld.timeCount?true:false;
		_past = istWorld.timeCount;

		//	TIME COUNT
		var _h = ( floor( istWorld.timeCount / 60 ) % 24 ) + 100;
		var _m = istWorld.timeCount % 60 + 100;
		var _s = floor( istWorld.frameCount * istWorld.speedRate * 60 ) % 60 + 100;
		_h = String( '' + _h ).substr( 1,2 );
		_m = String( '' + _m ).substr( 1,2 );
		_s = String( '' + _s ).substr( 1,2 );
		document.getElementById('timer').innerHTML = _h + ':' + _m + ':' + _s;

		if( !istWorld.timeChecker )
		{
			_pointerUpdate();
		}
		
		//	DRAW
		drawtrain();

		//	RESET TIMER
		if( istWorld.frameCount > istWorld.resetTime + 1440 / istWorld.speedRate )
		{
			_reset();
		}
	}

	function engine(){}

	function _pointerUpdate()
	{
		for( var l in istWorld.lineList )
		{
			var _schdule = istWorld.lineList[l].schdule;
			var _pointerlist = istWorld.lineList[l].pointerlist;
			var len3 = _schdule.length;
			for( var k = 0 ; k < len3; k++ )
			{
				var len = _schdule[k].length;
				for( var i = 0 ; i < len-1; i++ )
				{
					var _index = _getIndex( i, _pointerlist[k][i], k, istWorld.lineList[l].id );
					var _next = _getNext( i, _index, k, istWorld.lineList[l].id );

					if( istWorld.timeCount == _schdule[k][i][_index] )
					{
						//	移動開始
						var _startTime = _schdule[k][i][_index];
						var _endTime = _schdule[k][i][_next];
						var _dir = k;
						var _train = {
							id: istWorld.lineList[l].id,
							color: istWorld.lineList[l].color,
							startIndex: _index,
							endIndex: _next,
							start: _startTime,
							end: _endTime,
							dir: _dir
						}

						_pointerlist[k][i] = _next;

						if( _schdule[k][i].length > _pointerlist[k][i] )
						{
							//	追加
							if( istWorld.trainStock.length )
							{
								_train.obj = istWorld.trainStock.shift();
							} else {
								_train.obj = createTrain();
							}
							
							istWorld.attributes.customColor.value[ _train.obj.no ] = new THREE.Color( _train.color )
							istWorld.trainList.push( _train );
						}

					}
				}
			}
		}
	}

	function _getIndex( i, _index, k, _id )
	{
		var _schdule = istWorld.lineList[_id].schdule;
		if( _schdule[k][i].length < _index )
		{
			return _schdule[k][i].length - 1;
		}

		if( _schdule[k][i][_index] == '-' )
		{
			return _getIndex( i, _index + 1, k, _id )
		}

		return _index;
	}

	function _getNext( i, _index, k, _id )
	{
		var _schdule = istWorld.lineList[_id].schdule;
		var _next = _index + 1;
		if( _schdule[k][i].length < _next )
		{
			return _schdule[k][i].length - 1;
		}

		if( _schdule[k][i][_next] == '-' )
		{
			return _getNext( i, _next, k, _id );
		}

		return _next;
	}

	function _reset()
	{
		for( var i in istWorld.lineList )
		{
			var len = istWorld.lineList[i].pointerlist[0].length;
			for( var j = 0; j < len; j++ )
			{
				istWorld.lineList[i].pointerlist[0][j] = 0;
			}
			var len = istWorld.lineList[i].pointerlist[1].length;
			for( var j = 0; j < len; j++ )
			{
				istWorld.lineList[i].pointerlist[1][j] = 0;
			}
		}

		istWorld.trainList = [];
		istWorld.frameCount = ( parseInt( istWorld.worldStartTime.split(':')[0] ) * 60 + parseInt( istWorld.worldStartTime.split(':')[1] ) ) / istWorld.speedRate;
		istWorld.timeCount = 0;
		istWorld.timeChecker = false;
	}

	function drawtrain()
	{
		var _w = $( window ).width();
		var _h = $( window ).height();
		var __w = _w * 0.5;
		var __h = _h * 0.5;

		//	current
		var len = istWorld.trainList.length;

		while( len )
		{
			len--;
			var _tr = istWorld.trainList[len];
			var _id = _tr.id;
			var _dlist = istWorld.lineList[ _id ].dlist;
			var _duration = _tr.end - _tr.start;
			var _start = _tr.startIndex;
			var _end = _tr.endIndex;
			var _dir = _tr.dir;
			var _way = _dlist[_dir].slice( _start * istWorld.div, _end * istWorld.div + 1 );

			_duration /= istWorld.speedRate;
			var _startFrame = _tr.start / istWorld.speedRate;

			//	kill
			if( istWorld.timeCount >= _tr.end )
			{
				var __tr = istWorld.trainList.splice( len, 1 );
				istWorld.trainStock.push( __tr[0].obj );

				istWorld.trainObject.geometry.vertices[ __tr[0].obj.no ].x = 0;
				istWorld.trainObject.geometry.vertices[ __tr[0].obj.no ].y = 10000;
				istWorld.trainObject.geometry.vertices[ __tr[0].obj.no ].z = 0;
				continue;
			}

			var _dt = round( easeInOutSine(istWorld.frameCount - _startFrame,0,_way.length,_duration) );

			/*
			var _r = 3;
			var _rd = 1;
			if( _end - _start > 1 )
			{
				_r = 6;
				_rd = 2;
			}
			*/

			try{
				var _x = _way[_dt].x;
				var _y = _way[_dt].y;
				var _z = _way[_dt].z;

				var _no = _tr.obj.no;

				istWorld.trainObject.geometry.vertices[_no].x = _x;
				istWorld.trainObject.geometry.vertices[_no].y = _y;
				istWorld.trainObject.geometry.vertices[_no].z = _z;
			} catch(err){}
		}

		istWorld.trainObject.geometry.verticesNeedUpdate = true;
	}
});
