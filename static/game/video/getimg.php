<?php
$dir = __dir__ . DIRECTORY_SEPARATOR;
$images = scandir($dir);
$images = array_slice($images, 2);
foreach($images as $k => $v){
  echo "\n{$dir}{$v}\n";
  
}

