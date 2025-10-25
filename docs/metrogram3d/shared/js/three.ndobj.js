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

