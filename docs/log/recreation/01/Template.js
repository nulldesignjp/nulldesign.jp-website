/*
	Template.js
*/

var TemplateClass = (function(){
	function main( scene )
	{
		this.isAlive;
		this.scene;
		this.mesh;

		this.init( scene );
	}

	main.prototype = 
	{
		init : function( scene )
		{
			this.isAlive = true;
			this.scene = scene;
		},
		update : function()
		{
			if( !this.isAlive ){	return;	}
			//

			var _t = this;
			window.requestAnimationFrame( function(){	_t.update(); })
		},
		viewWillAppear : function()
		{
			var _t = this;
			this.mesh.scale.set( 0.01, 0.01, 0.01 );
			TweenMax.to( this.mesh.scale, 1.0, {	x: 1.0, y: 1.0, z: 1.0,
				onComplete: function()
				{
					_t.viewDidAppear();
				}
			})
		},
		viewDidAppear : function(){},
		viewWillDisappear : function(){},
		viewDidDisappear : function(){},
		dispose : function()
		{
			this.isAlive = false;
			this.scene.remove( this.mesh );
			this.mesh = null;
			this.scene = null;
			return false;
		}
	};

	return main;
})();