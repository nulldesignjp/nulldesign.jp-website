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
				var attributes = {
					size: {	type: 'f', value: [] },
					customColor: { type: 'c', value: [] }

				};

				var uniforms = {
					amplitude: { type: "f", value: 1.0 },
					color:     { type: "c", value: new THREE.Color( 0xffffff ) },
					texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "shared/img/spark1.png" ) },

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
			}
			function _error( meg ){}
		}
	};
	return main;
})();