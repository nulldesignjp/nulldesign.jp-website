/*
	main.js
*/


var main = function(e)
{
	main.root = e;
}

main.root;
main.domain = '';
main.json = 'hoge.json';
//main.json = 'imagedata.php';
main.cache = '?nocache=' + new String( new Date().getTime() );
main.space = new RegExp(/ /g);
main.data;
main.dataList;
main.count = 0;
main.time = 7000;

main.prototype = 
{
	execute	:	function()
	{
		//	navigator.onLine ? "オンラインです" : "オフラインです"
		var _this = this;
		$.ajax({
			url: main.json,
			//cache	:	false,
			//type	:	'POST',
			//dataType	:	'json',
			success	:	function( e ){ _this.parseJson( e );	}
		});
	},
	parseJson	:	function( e )
	{
		main.data = eval("("+e+")");
		main.dataList = main.data.posts;
		
		//console.log( main.dataList );
		
		var _this = this;
		var _post = new view( main.dataList[main.count], main.root );
		$( _post ).bind( 'complete', function(e){	_this.nextScene( e.target );	});
	},
	nextScene	:	function( e )
	{
		var _this = this;
		setTimeout( function(){
			$( e ).unbind( 'complete' );
			e.kill();
			
			main.count++;
			main.count %= main.dataList.length;
			
			var _post = new view( main.dataList[main.count], main.root );
			$( _post ).bind( 'complete', function(e){	_this.nextScene( e.target );	});
		}, main.time )
	}
}