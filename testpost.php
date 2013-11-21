<?php

// upload and save picture

// !!! requires GD image module

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

//Get post title
$title = (isset($request->title) ? $request->title : '');

//Get post tags
$tags = (isset($request->tags) ? $request->tags : array()); 

//Get user id
$user_id = (isset($request->user) ? $request->user : '');


//insert title and tags into database to get the MySQL insert ID before saving image!!!
$mysqli = getConnection();

//parse tags and insert each into tag table if they don't exist

	foreach ($tags as $tag) {

		$tag_text = trim($tag->text);
		$tag_text = str_replace(' ', '', $tag_text);

		$sql = "select * from tag where tag_text = '$tag_text'";
		$result = $mysqli->query($sql);		
		if ($result->num_rows == 0) {		
			$sql = "insert into `tag` (`tag_text`) values ('$tag_text')";
			$mysqli->query($sql);
			$id_tag[] = $mysqli->insert_id;
		}
		else {
			$queried_result = $result->fetch_assoc();
			$id_tag[] = $queried_result["id_tag"];
		}
		$result->close();
	}

	$sql = "insert into `activity` (`id_member`, `title`) values ($user_id, '$title')";
	$mysqli->query($sql);
	$id_activity = $mysqli->insert_id;

	//then insert activity ID and tag ID into goodfor table

	foreach($id_tag as $tag) {
		$sql = "insert into `goodfor` (`id_tag`, `id_activity`) values ($tag, $id_activity)";
		$mysqli->query($sql);
	}

	$mysqli->close();

//Process Image
$img = $request->image->imgBase64;
$bot_cutoff_pct = (isset($request->image->botCutoffPct) ? $request->image->botCutoffPct : 0);
$top_cutoff_pct = (isset($request->image->topCutoffPct) ? $request->image->topCutoffPct : 0);
$left_cutoff_pct = (isset($request->image->leftCutoffPct) ? $request->image->leftCutoffPct : 0);
$right_cutoff_pct = (isset($request->image->rightCutoffPct) ? $request->image->rightCutoffPct : 0);
$move_axis = (isset($request->image->moveAxis) ? $request->image->moveAxis : ''); //"vertical" or "horizontal"

//0. Convert base64 to image

$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = '../img/activity/' . $id_activity . '.png'; //this is the mysql insert ID from above
$success = file_put_contents($file, $data);

if ($success) {

	list($width, $height) = getimagesize($file); //dimensions in pixels
	$top_cutoff = $top_cutoff_pct*$height;
	$bot_cutoff = $bot_cutoff_pct*$height;
	$right_cutoff = $right_cutoff_pct*$width;
	$left_cutoff = $left_cutoff_pct*$width;

	$src_w = $width - $right_cutoff - $left_cutoff;
	$src_h = $height - $bot_cutoff - $top_cutoff;

	$src_x = $left_cutoff;
	$src_y = $top_cutoff;

	$img_src = imagecreatefrompng($file);
	$img_dest = imagecreatetruecolor(400, 300);

	imagecopyresized($img_dest, $img_src, 0, 0, $src_x, $src_y, 400, 300, $src_w, $src_h);
	imagepng($img_dest, $file);

	imagedestroy($img_src);
	imagedestroy($img_dest);

}

function getConnection() {
	$db_hostname = 'localhost';
	$db_database = 'smorg';
	$db_username = 'root';
	$db_password = 'Jesusisking!12';
	$mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
	return $mysqli;
}

?>