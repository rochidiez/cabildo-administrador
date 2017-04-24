<?php 

function log2file($path, $data, $mode="a"){
   $fh = fopen($path, $mode) or die($path);
   fwrite($fh,$data . "\n");
   fclose($fh);
   chmod($path, 0777);
}

$line = date('H:i:s') . ' - ' . trim($_POST['line']);
\log2file( __DIR__ . "/logs/ecma-" . date('Y-m-d') . ".log",$line); 