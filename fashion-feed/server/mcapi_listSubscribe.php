<?php

// curl -d "email=a%40a.com&first=John&last=Doe&location=South+Tampa" http://leeroyselmons.com/club63interruptor/mcapi_listSubscribe.php

header('Content-Type: application/json; charset=utf8');

require_once 'MCAPI.class.php';
require_once 'config.php';
$api = new MCAPI($apikey);

$email = $_REQUEST['email'];
// $first = $_POST['first'];
// $last = $_POST['last'];
// $location = $_POST['location'];

$merge_vars = array(
//	'FNAME'=>$first, 
//	'LNAME'=>$last,
//	'MERGE3'=>$location
);

// By default this sends a confirmation email - you will not see new members
// until the link contained in it is clicked!
$retval = $api->listSubscribe( $listId, $email, $merge_vars );

if ($api->errorCode || $retval == false){
	if ($production) {
		$output = array("result" => "error");
	}
	else {
		$output = array(
			"result" => "error",
			"code" => $api->errorCode,
			"message" => $api->errorMessage
		);
	}
}
else {
	$output = array("result" => "success");
}

$json = json_encode($output);

echo isset($_REQUEST['callback'])
    ? "{$_REQUEST['callback']}($json)"
    : $json;

?>
