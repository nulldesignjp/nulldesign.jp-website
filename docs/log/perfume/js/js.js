/*
	js.js
*/

$(function(){
	(function($){
		var isWebGlEnabeld = Detector.webgl;
		var _count = 0;
		var _currentFrame = 0;
		var _loadCount = 0;
		var renderer;
		var _canvas;
		var container;
		var scene;
		var camera;
		var light;
		var plane;
		
		var _loadList = [
			'aachan.bvh',
			'kashiyuka.bvh',
			'nocchi.bvh'
		];
		
		var _colorList = [
			0xCC0000,
			0x00CC00,
			0x0000CC
		];
		
		var _dataList = [];
		var _motiList = [];
		var _offsetList = [];
		var _pointList = [];
		
		
		
		
		
		_canvas = document.createElement( 'CANVAS' );
		if( !_canvas || !_canvas.getContext )
		{
			var _p = document.createElement( 'p' );
			_p.classname = 'noCanvas';
			$( _p ).text('CANVASに対応したブラウザが必要なコンテンツです。');
			$( '#container').append( _p );
			return;
		} else {
			_loadBVH();
		}
				
		/*
			functions
		
		
		
		*/
		
		function _loadBVH()
		{
			var _url = _loadList.pop();
			$.ajax({
			    url: _url,
			    error: function(){
			        alert("xmlファイルの読み込みに失敗しました");
			    },
			    success: function( xml ){
			  		var list = xml.split(/[\r\n]+/);
			  		var hier = [];
			  		var moti = [];
			  		var motionFlag = false;
			  		
			  		list = list.reverse();
			  		
			  		_motiList[_motiList.length] = [];
			  		
			  		for( var i = 0; i < list.length; i++ )
			  		{
			  			var _line_str = rstrip( list[i] );
				  		if( _line_str.indexOf("OFFSET") != -1 )
				  		{
					  		var _obj = {};
					  		_dataList.push([])
					  		_dataList[_loadCount].push( _obj );
				  		}
				  		
				  		if( _obj )
				  		{
					  		if( _line_str.indexOf("JOINT") != -1 )
					  		{
					  			var _result = _line_str.split(' ');
					  			_result.shift();
						  		_obj.name = _result[0];
						  		if( _obj.name == '' ) _obj.name = 'undefined';
					  		}
					  		if( _line_str.indexOf("OFFSET") != -1 )
					  		{
					  			var _result = _line_str.split(' ');
					  			_result.shift();
					  			
					  			_result = _result.concat( _result );
						  		_obj.offset = _result;
					  		}
				  		}
				  		
				  		
				  		if( motionFlag )
				  		{
					  		_motiList[_motiList.length-1].push( _line_str.split( ' ' ) );
				  		}
				  		
				  		if( _line_str.indexOf("MOTION") && !motionFlag )
				  		{
					  		motionFlag = true;
				  		}
				  	}
			    	
			    	var _color = _colorList.pop();
			    	var _points = [];
			    	for( var i = 0; i < 12; i++ )
			    	{
				    	var _r = ( i == 0 )? 20 : 5;

				    	var _geometry = new THREE.SphereGeometry( _r, 12, 12 );
				    	var _material = new THREE.MeshLambertMaterial( { color: _color, shading: THREE.FlatShading, overdraw: true } );
						var _sphere = new THREE.Mesh( _geometry, _material );
						_points.push( _sphere );
			    	}
			    	
			    	_pointList.push( _points );
			    	
			    	
			    	if( _loadList.length != 0 )
			    	{
			    		_loadCount++;
				    	_loadBVH();
			    	} else {
				    	_initialize();
			    	}
			    }
			});
		}
		
		function _initialize()
		{
			//	default setting
			container = document.getElementById('container');
			scene = new THREE.Scene();
			
			camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 10000 );
			camera.position.set( 0, 500, 1000 );
			camera.lookAt( {x:0, y:200, z:0 } );
			scene.add( camera );
			
			light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
			light.position.set( 1, 1, 1 ).normalize();
			scene.add( light );
			
			
			//	renderer
			if( isWebGlEnabeld )
			{
				renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0x000000 } );
			} else {
				renderer = new THREE.CanvasRenderer();
			}
			renderer.setSize( container.clientWidth, container.clientHeight );
			container.appendChild( renderer.domElement );
			
			//	test
			plane = new THREE.Mesh( new THREE.PlaneGeometry( 1600, 1600 ), new THREE.MeshBasicMaterial( { color: 0x666666 } ) );
			plane.rotation.x = - 90 * ( Math.PI / 180 );
			scene.add( plane );
			
			
			var len0 = _pointList.length;
			for( var i = 0; i < len0; i++ )
			{
				var len1 = _pointList[i].length;
				for( var j = 0; j < len1; j++ )
				{
					scene.add( _pointList[i][j] );
				}
			}
			
			$( window ).bind( 'resize', _onresize );
			animate();
			
			setInterval( function(){
				var lenAll = _pointList.length;
				
				for( var j = 0; j < lenAll; j++ )
				{
					
					var _motion = _motiList[j][_currentFrame+2];
					var len = _pointList[j].length;
					
					for( var i = 0; i < len; i++ )
					{
						var _data = _dataList[j][i];
						
						if( _data['name'] != 'undefined' )
						{
							_pointList[j][i].position.x = Number( _data.offset[0] ) + Number( _motion[i*6+0] ) + Number( _motion[0] );
							_pointList[j][i].position.y = Number( _data.offset[1] ) + Number( _motion[i*6+1] ); + Number( _motion[1] );
							_pointList[j][i].position.z = Number( _data.offset[2] ) + Number( _motion[i*6+2] ); + Number( _motion[2] );
							//_pointList[j][i].rotation.x = _data.offset[i*6 + 3];
							//_pointList[j][i].rotation.y = _data.offset[i*6 + 4];
							//_pointList[j][i].rotation.z = _data.offset[i*6 + 5];
							
							_pointList[j][i].position.x *= 3;
							_pointList[j][i].position.y *= 3;
							_pointList[j][i].position.z *= 3;
							
							_pointList[j][i].position.y += 300;
							
						} else {
							_pointList[j][i].alpha = 0;
						}
					}
				}
				
				_currentFrame++;
				_currentFrame %= 2820;
			}, 1000 / 40 );

		}
		
		function animate()
		{
			requestAnimationFrame( animate );
			render();
		}
		
		function render()
		{
			_count++;
			
			//	camera
			var _cos = Math.cos( .005 );
			var _sin = Math.sin( .005 );
			var _x = camera.position.x;
			var _z = camera.position.z;
			camera.position.x = _x * _cos - _z * _sin;
			camera.position.z = _x * _sin + _z * _cos;
			camera.position.y = Math.sin( _count * .01 ) * 200 + 500;
			camera.lookAt( {x:0, y:200, z:0 } );

			renderer.render( scene, camera );
		}
		
		function _loop()
		{
		
		}
		
		function _onresize( e )
		{
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( container.clientWidth, container.clientHeight );
		}
		
		// 左のスペースを取り除く
		function rstrip(s){
		    return s.replace(/^\s+/,"");
		}
		
	})(jQuery);
});