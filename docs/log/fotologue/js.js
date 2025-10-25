/*
	js.js
*/
document.body.style.visible = 'hidden';
$(function(){
	(function($){
	
		$( 'body' ).css({
			'visible'	:	'visible',
			'opacity'	:	0
		}).animate({
			'opacity'	:	1
		}, 1000 );
		
		var _main = new main('#container');
		$( window ).bind( 'resize', _resize );
		$( window ).bind( 'scroll', _scroll );
		
		_main.execute();
		
		/*
		
		*/
		function _resize( e ){	resize();	}
		function resize()
		{
		}
		
		function _scroll( e ){	scroll();	}
		function scroll()
		{
		}
		
	})(jQuery);
});