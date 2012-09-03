<?php

header('Content-Type: application/json; charset=utf8');

$code = $_REQUEST['code'];

$valid = "false";

if ($code === '12345')
	$valid = "true";

$output = array( "valid" => $valid, "code" => $code );

$json = json_encode($output);

echo isset($_REQUEST['callback'])
    ? "{$_REQUEST['callback']}($json)"
    : $json;

?>