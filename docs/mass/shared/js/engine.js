/*
	engine.js
*/

var _ua = getUA();
if( _ua.iphone || _ua.android )
{
	$('body').addClass('sp');
}

(function(){
	//	各種プロパティ	
	var scene, camera, renderer, container, ___killingObj;
	var _typoList = [];
	var _mode = 0;	//	0がシングル。1がマルチ
	var _changeKey;
	var _keys = {
		32:'undefined', 65: 'a',66: 'b',67: 'c',68: 'd',69: 'e',70: 'f',71: 'g',72: 'h',73: 'i',74: 'j',75: 'k',76: 'l',77: 'm',78: 'n',79: 'o',80: 'p',81: 'q',82: 'r',83: 's',84: 't',85: 'u',86: 'v',87: 'w',88: 'x',89: 'y',90: 'z'
	};
	var _singleTypoMode;
	var _singleTypoCount = 64;

	//	
	document.getElementById('container').className = 'introHide';
	setTimeout(function(){
		document.getElementById('container').className = 'fadeIn';
		start();
	},500);
	

	//	実行フェイズ
	init();
	addEvents();

	//_mode = 1;
	if( _mode == 1 )
	{
		setMessage('mass');
	} else {
		_mode = 1;
		changeMode(0);
	}
	
	_changeModeButtons(_mode);

	//	初期化。主にthreejs系のインスタンスの生成。
	function init()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		focus = new THREE.Vector3( 0, 0, 0 );

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 800, 1600 );

		camera = new THREE.OrthographicCamera( _width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1600 );
		camera.position.set(0, 0, 1000);
		camera.lookAt(focus);

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setClearColor(0x000000, 1);
		renderer.setSize(_width, _height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.autoClear = false;

		container = new THREE.Object3D();
		scene.add( container );

		//	the one
		// if( _mode == 0 )
		// {
		// 	var _typoNew = new spheretypo( _mode );
		// 	container.add(_typoNew.container);
		// 	_typoNew.setScale(0.0);

		// 	var _slow = Math.random() * 0.14 - 0.07 + 1.075000;
		// 	var _accell = Math.random() * 130 - 65 + 70;
		// 	var _data2 = _typoNew.getTypo('undefined');
		// 	addList( _typoNew, _data2.rotX, _data2.rotY, _slow, _accell );

		// 	container.position.set(0,0,0);
		// }

		document.getElementById('container').appendChild(renderer.domElement);

		//	displayObject3Dが表示エリア(scene)状に存在しない場合、renderが走らないケースがあるので、
		//	見えない状態のmeshを一つ保険で入れておく
		var geometry = new THREE.PlaneGeometry(100,100,1,1);
		var material = new THREE.MeshBasicMaterial({wireframe:true,transparent:true,opacity:0});
		___killingObj = new THREE.Mesh(geometry,material);
		scene.add( ___killingObj );
	}

	function start()
	{
		render();
	}

	function render(){
		var _size = 100;
		var _num = 8;

		var len = _typoList.length;
		while( len )
		{
			len = ( len - 1 ) | 0;
			var _typo = _typoList[len];
				_typo.update();

				var _tx = len%_num * _size;
				var _ty = - Math.floor( len / _num ) * _size;
				var _tz = 0;
				var _x = _typo.container.position.x;
				var _y = _typo.container.position.y;
				var _z = _typo.container.position.z;
				_x += ( _tx - _x ) * 0.1;
				_y += ( _ty - _y ) * 0.1;
				_z += ( _tz - _z ) * 0.1;

				_typo.setPosition( _x, _y, _z );

			//	init scale
			var _targetScale = _mode == 0 ? 2.0 : 0.5;
			var _scale = _typo.container.scale.x;
			_typo.scaleVector = ( _typo.scaleVector + (_targetScale- _scale ) / 20 ) / 1.095;
			_scale += _typo.scaleVector;
			_typo.container.scale.set( _scale, _scale, _scale );
		}


		var _no = _typoList.length;
		var __x = _num>_no?_no:_num;
		__x = - ( ( __x - 1 ) * 0.5 ) * _size;
		var __y = Math.floor( ( _no - 1 ) / _num ) * _size * 0.5;

		var _x = container.position.x;
		var _y = container.position.y;
		_x += ( __x - _x ) * 0.1;
		_y += ( __y - _y ) * 0.1;
		container.position.set( _x, _y, 0 );

		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);

	}

	//	eventlistener 各種
	function addEvents()
	{
		window.addEventListener( 'resize', function(e){
			var _width = window.innerWidth;
			var _height = window.innerHeight;
                if (camera.aspect) {
                    camera.aspect = _width / _height;
                }
                else {
                    camera.left = -_width * 0.5;
                    camera.right = _width * 0.5;
                    camera.top = _height * 0.5;
                    camera.bottom = -_height * 0.5;
                }
			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );
		}, false );
		window.addEventListener( 'keydown', function(e){
			var _keyCode = e.keyCode;

			//	delete	8
			if( _keyCode == 8 && _typoList.length )
			{
				removeList( _typoList.length - 1 );
				return;
			}

			//	esc	27
			if( _keyCode == 27 && _typoList.length )
			{
				var len = _typoList.length;
				while( len )
				{
					len --;
					removeList( len );
				}
				return;
			}

			//	ent	32
			if( _keyCode == 13 || _keyCode == 32 )
			{
				var len = _typoList.length;
				while( len )
				{
					len --;
					_typoList[len].containerInner.rotation.x = (Math.random()*2-1)*Math.PI;
					_typoList[len].container.rotation.y = (Math.random()*2-1)*Math.PI;
				}
			}

			if( _keyCode >= 65 || _keyCode <= 90 )
			{
				_singleTypoCount = _keyCode;
			}	

			//	new
			if( _mode == 1 )
			{
				var _typoNew = new spheretypo();
				container.add(_typoNew.container);
				_typoNew.setScale(0.0);
				var _data2 = _typoNew.getTypo(_keys[_keyCode]);
				_typoNew.setTypoColor(_keys[_keyCode]);

				var _size = 100;
				var _no = _typoList.length;
				var _num = 8;

				var _x = _no%_num * _size;
				var _y = - Math.floor( _no / _num ) * _size;
				var _z = 0;

				var _slow = Math.random() * 0.08 - 0.04 + 1.055000;
				var _accell = Math.random() * 48 - 24 + 70;

				_typoNew.setPosition(_x, _y, _z );
				_typoNew.setOpacity(0.5);
				_typoNew.setOpacities(0.1, 1.0);
				addList( _typoNew, _data2.rotX, _data2.rotY, _slow, _accell );
			} else {
				var _typoNew = _typoList[0];
				var _data2 = _typoNew.getTypo(_keys[_keyCode]);
				_typoNew.setTypoColor(_keys[_keyCode]);
				_typoNew.rotation.x = - _data2.rotX;
				_typoNew.rotation.y = _data2.rotY;
			}
		});
		window.addEventListener( 'touchmove', function(e){
			for( var i = 0; i < _typoList.length; i++ )
			{
				var _typoNew = _typoList[i];
				var _keyCode = Math.floor( Math.random() * ( 90 - 65 ) + 65 );
				var _data2 = _typoNew.getTypo(_keys[_keyCode]);
				_typoNew.setTypoColor(_keys[_keyCode]);
				_typoNew.rotation.x = - _data2.rotX;
				_typoNew.rotation.y = _data2.rotY;
			}
			console.log('touchmove')
			e.preventDefault();
		}, false );

		//	モードチェンジ(PC only)
		$('#selectModeBlock').css('display','block');
		$('#btnSingle').on('click',function(){	changeMode(0);	});
		$('#btnMulti').on('click',function(){	changeMode(1);	});
		$('#btnAbout').on('click',function(){	$('#aboutBlock01').toggleClass('show');	_chkMod();	});
		$('#aboutBlock01').on('click',function(){	$('#aboutBlock01').removeClass('show');	_chkMod();	});

		function _chkMod()
		{
			if( $('#aboutBlock01').hasClass('show') )
			{
				$('#btnAbout').addClass('current');
			} else {
				$('#btnAbout').removeClass('current');
			}
		}
	}

	//	single/multiの切り替え
	function changeMode(e)
	{
		//	同じ状態はキープ
		if( _mode == e ){return}

		//	single mode return;
		_singleTypoCount = 64;
		clearInterval( _singleTypoMode );

		//	全部消す（演出を含めていないため）	
		var len = _typoList.length;
		while( len )
		{
			len = ( len - 1 ) | 0;
			removeList( len );
		}

		//	強制的に初期状態に
		_typoList = [];
		_mode = e;

		//	シングルモードの時は、ディスプレイ中央にひとつつくっておく
		if( _mode == 0 )
		{
			var _typoNew = new spheretypo(_mode);
			container.add(_typoNew.container);
			_typoNew.setScale(0.0);

			var _slow = Math.random() * 0.10 - 0.05 + 1.075000;
			var _accell = Math.random() * 80 - 40 + 70;
			var _data2 = _typoNew.getTypo('undefined');
			addList( _typoNew, _data2.rotX, _data2.rotY, _slow, _accell );

			container.position.set(0,0,0);

			_singleTypoMode = setInterval( _setNextFont, 4000);
		} else {
			setMessage('mass');
		}

		//	ボタン状態を最後に切り替える
		_changeModeButtons(e);
	}
	function _setNextFont()
	{
		if( _singleTypoMode )
		{
			var _c = _singleTypoCount - 65;
			_c ++;
			_c %= ( 91 - 65 );
			_c += 65;
			_singleTypoCount = _c;

			var _typoNew = _typoList[0];
			var _keyCode = _singleTypoCount;
			var _data2 = _typoNew.getTypo(_keys[_keyCode]);
			_typoNew.setTypoColor(_keys[_keyCode]);
			_typoNew.rotation.x = - _data2.rotX;
			_typoNew.rotation.y = _data2.rotY;

		}
	}
	//	single/multiのボタン表示切り替え
	function _changeModeButtons(e)
	{
		$('#btnSingle').removeClass();
		$('#btnMulti').removeClass();

		if( e == 0 )
		{
			$('#btnSingle').addClass('current');
		} else {
			$('#btnMulti').addClass('current');
		}
	}

	//	インスタンス情報の保持
	function addList( e, _tx, _ty, _slow, _accell )
	{
		e.rotation.x = - _tx;
		e.rotation.y = _ty;
		e.containerInner.rotation.x = (Math.random()*2-1)*Math.PI;
		e.container.rotation.y = (Math.random()*2-1)*Math.PI;
		e.slow = _slow;
		e.accell = _accell;

		_typoList.push( e );


		//	一定数を超えると削除
		if( _typoList.length > 32 )
		{
			//	removeList(0);
			for( var i = 0; i < 8; i++ )
			{
				(function(){
					var _dt = ( i * 33 + 20 ) * 0.001;
					var _typo = _typoList.shift();
					var _sy = _typo.container.position.y;
					TweenMax.to( _typo.container.position, 0.2 + _dt, {y: _sy+100} );
					TweenMax.to( _typo.particle.material, 0.2 + _dt, {opacity:0} );
					TweenMax.to( _typo.line.material, 0.2 + _dt, {opacity:0} );
					TweenMax.to( _typo.container.scale, 0.2 + _dt, {x:0.01,y:0.01,z:0.01, onComplete: function(){
						container.remove( _typo.container );
						_typo.kill();
						_typo = null;
					}} );
				})();
			}
		}
	}

	function removeList(e)
	{
		var _time = 0.3;
		var _typo = _typoList.splice(e,1);
		_typo = _typo[0];

		_typo.container.position.x += container.position.x;
		_typo.container.position.y += container.position.y;
		_typo.container.position.z += container.position.z;
		scene.add(_typo.container)

		TweenMax.to( _typo.particle.scale, _time, {x:2,y:2,z:2} );
		TweenMax.to( _typo.line.scale, _time, {x:2,y:2,z:2} );
		TweenMax.to( _typo.particle.material, _time, {opacity:0} );
		TweenMax.to( _typo.line.material, _time, {opacity:0,onComplete:function(){
			scene.remove( _typo.container );
			_typo.kill();
			_typo = null;
		}} );
	}

	function setMessage( e )
	{
		for( var i = 0; i < e.length; i++ )
		{

			var _keyCode = 0;
			var __t = e.charAt(i);
			for( var j in _keys )
			{
				if( _keys[j] == __t )
				{
					//_keyCode = j;
					doit(i,j);
					break;
				}
			}

			function doit(i,e)
			{
				setTimeout(function(){
					var _typoNew = new spheretypo();
					container.add(_typoNew.container);
					_typoNew.setScale(0.0);
					var _data2 = _typoNew.getTypo(_keys[e]);
					_typoNew.setTypoColor(_keys[e]);

					var _size = 100;
					var _no = _typoList.length;
					var _num = 8;

					var _x = _no%_num * _size;
					var _y = - Math.floor( _no / _num ) * _size;
					var _z = 0;

					var _slow = Math.random() * 0.12 - 0.06 + 1.075000;
					var _accell = Math.random() * 96 - 48 + 50;

					_typoNew.setPosition(_x, _y, _z );
					_typoNew.setOpacity(0.5);
					_typoNew.setOpacities(0.1, 1.0);
					addList( _typoNew, _data2.rotX, _data2.rotY, _slow, _accell );
				},100 * i + 1000);
			}

	
		}
	}

})();