<?php

// upload and save picture

// !!! requires GD image module

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$imgdata = json_encode($request->image);

$imgBase64 = $imgdata->imgBase64;
echo $imgBase64;

//get image data


//0. Convert base64 to image

$img = imagecreatetruecolor(400, 300); // creates a placeholder

//1. Cut off percentage of image


//2. Resize image to 3/4 aspect ratio


//3. Save image

$dest = '/';

//imagecopy($dest, $src, )

//destroy extra stuff
imagedestroy($img);

?>