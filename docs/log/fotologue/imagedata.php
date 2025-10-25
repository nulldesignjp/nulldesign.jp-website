<?PHP
header('Content-type: text/xml; charset=UTF-8');
mb_language("Japanese");

/* ドメイン               */
$domain      = "";
/* 記録させないパターン   */
$nonSave     = array("contents", "js");
$xmlData = '';



$nonMax      = count($nonSave);
$dir   = "./";
$str   = "";
$now   = $dir;
$count = 0;
$fp    = 1;

$id = 0;


if (0 == walkingDir($dir , $str , $fp)){
  print "開けなかったディレクトリがありました。<br>\n";
}

function walkingDir($dir , $str = "" , $fp = null){

  global $xmlData;
  global $count;
  global $id;
  global $domain;
  global $nonSave;
  global $nonMax;
  $path = substr($dir , 2);
  $str .= "　";

  // パーミッションのチェック
	//ファイルが開けないときはアウト、 0を返す。
  if (FALSE == ($df = @openDir($dir))){
    print "<b>「 {$dir} 」</b> を開けませんでした。";
    return 0;
  }


  while($fileName = readDir($df)){
    if ($fileName == "." || $fileName == ".."){
    }else{
      $count++;

      // jpgファイルなら
      if (preg_match("/\.jpg?$/i" , $fileName)){
        // 記録しないファイルかチェック
        for($non = $i = 0; $i < $nonMax; $i++){
          if (strstr($dir . "/" . $fileName , $nonSave[$i])){
		$non = 1;
		break;
          }
        }

	//禁止文字列があったら今回の処理を中断
        if ($non) continue;

        if ($fp){
			$fname = $path.$fileName;

			$dat= getexif($fname, $list);
			$update = $list["DateTimeOriginal"];
			$iso = $list["ISOSpeedRatings"];
			$focue = $list["FNumber"];
			$ss = $list["ExposureTime"];
			$model = $list["Model"];
			$categories = explode( '/', $fname );
			$category = $categories[0];
			$id++;
			
			
$article = <<<eof
		{
			'title'	:	'$fname',
			'date'	:	'$update',
			'file'	:	'$fname',
			'description'	:	'$model $iso $focue $ss',
			'category'	:	'$category'
		},
eof;

$xmlData = $xmlData.$article;
        }

      // HTMLファイル以外なら
      } else {


        // ディレクトリなら
        if (is_dir($dir . "/" . $fileName)){
          if (0 == walkingDir($dir . $fileName . "/" , $str , $fp)){
            continue;
          }
        }
      }
    }
  }
  return 1;
}



/**
 * Exif情報を配列に格納する
 * @param	String $fname 画像ファイル名
 * @param	Array  $exif  Exif情報を格納する配列
 * @return	0:正常に表示した
 *          (-1): ファイルが存在しない
 *          (-2): JPEG/TIFF以外の形式
 *          (-3): Exif情報がない
*/
function getexif($fname, &$exif) {
	//ファイルの存在チェック
	if (file_exists($fname) == FALSE)	return (-1);

	//JPEG/TIFFの型チェック
	switch (exif_imagetype($fname)) {
		case IMAGETYPE_JPEG:
		case IMAGETYPE_PNG:
		case IMAGETYPE_TIFF_II:
		case IMAGETYPE_TIFF_MM:
			break;
		default:
			return (-2);
	}

	//Exif情報を配列へ
	if (($cls = exif_read_data($fname, 'EXIF')) == FALSE)	return (-3);
	foreach ($cls as $key=>$sect) {
		if (is_array($sect) == FALSE) {
			$exif[$key] = $sect;
		} else {
			foreach($sect as $name=>$val)	$exif[$key . '.' . $name] = $val;
		}
	}
	return 0;
}
	
	
	
	


?>
<?PHP
#echo('<?xml version="1.0" encoding="UTF-8"?>');?>

{
	'POSTS':
	[
<?php echo( $xmlData );?>
	]
}