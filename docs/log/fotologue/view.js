/*
	view.js
*/

var view = function( _data, _root )
{
	this.data;
	this.post;
	this.view;
	this.title;
	this.description;
	this.date;
	
	//
	this._initialize.apply( this, arguments );
}

view.fadeTime = 1600;

view.prototype = 
{
	_initialize	:	function( _data, _root )
	{
		this.data = _data;
		
		this.post = document.createElement('div');
		this.post.className = 'post';
		$( _root ).append( this.post );
		$( this.post ).css({
			'opacity'	:	0
		})
		
		var _this = this;
		this.view = new Image();
		this.view.onload = function()
		{
			_this.fadeIn();
			$( _this ).trigger( 'complete' );
		};
		
		this.title = document.createElement('h2');
		this.title.innerHTML = this.data.title;
		
		this.description = document.createElement('p');
		this.description.innerHTML = this.data.description;
		
		this.date = document.createElement('p');
		this.date.className = 'date';
		this.date.innerHTML = this.data.date;
		
		this.post.appendChild( this.view );
		this.post.appendChild( this.title );
		this.post.appendChild( this.date );
		this.post.appendChild( this.description );
		
		this.view.src = this.data.file;
	},
	fadeIn	:	function()
	{
		var _w = $( window ).width();
		var _h = $( window ).height();
		var _imgW = $( this.view ).width();
		var _imgH = $( this.view ).height();
		
		var _parW = _w / _imgW;
		var _parH = _h / _imgH;
		var _par = ( _parW>_parH)?_parW:_parH;
		
		_imgW *= _par;
		_imgH *= _par;
		
		var _mt = 0;
		var _ml = 0;
		var _mt0 = 0;
		var _ml0 = 0;
		
		
		if( _imgW > _w )
		{
			_ml = _imgW - _w;
		} else {
			_mt = _imgH - _h;
		}
		//console.log( _imgW, _imgH, _w, _h, _ml, _mt );
		
		var _random = Math.random();
		if( _random <= .5 )
		{
		} else {
			_mt0 = _mt;
			_ml0 = _ml;
			_mt = 0;
			_ml = 0;
		}
		
		var _time = ( main.time + view.fadeTime ) * .001;
		$( this.view ).css({
			'marginTop'	:	- _mt0 + 'px',
			'marginLeft'	:	- _ml0 + 'px'
		});
		
		var _this = this;
		setTimeout(function(){
			$( _this.post ).css({
				'-moz-transition-duration'	:	_time + 's',
				'-webkit-transition-duration' : _time + 's',
				'-o-transition-duration'	:	_time + 's',
				'-ms-transition-duration'	:	_time + 's',
				'opacity'	:	1
			});
			
			$( _this.view ).css({
				'-moz-transition-duration'	:	_time + 's',
				'-webkit-transition-duration' : _time + 's',
				'-o-transition-duration'	:	_time + 's',
				'-ms-transition-duration'	:	_time + 's',
				'marginTop'	:	- _mt + 'px',
				'marginLeft'	:	- _ml + 'px'
			});
		}, 100);
	},
	fadeOut	:	function()
	{
		
	},
	kill	:	function()
	{
		var _this = this;
		var _time = view.fadeTime * .001;
		$( this.post ).css({
			'-moz-transition-duration'	:	_time + 's',
			'-webkit-transition-duration' : _time + 's',
			'-o-transition-duration'	:	_time + 's',
			'-ms-transition-duration'	:	_time + 's',
			'opacity'	:	0
		});
		
		setTimeout(function(){
			$( _this.view ).remove();
			$( _this.title ).remove();
			$( _this.description ).remove();
			$( _this.date ).remove();
			$( _this.post ).remove();
			
			_this.data = null;
		}, view.fadeTime );
		
		
	}
};