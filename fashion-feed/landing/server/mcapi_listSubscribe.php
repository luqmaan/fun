<?php

// curl -d "email=a%40a.com&first=John&last=Doe&location=South+Tampa" http://leeroyselmons.com/club63interruptor/mcapi_listSubscribe.php

header('Content-Type: application/json; charset=utf8');

require_once 'MCAPI.class.php';
require_once 'config.php';
$api = new MCAPI($apikey);

$email = $_POST['email'];
$first = $_POST['first'];
$last = $_POST['last'];
$location = $_POST['location'];

if (!$production) {
	echo $email . "\n";
	echo $first . "\n";
	echo $last . "\n";
	echo $location . "\n";
}

$merge_vars = array(
	'FNAME'=>$first, 
	'LNAME'=>$last,
	'MERGE3'=>$location
);

// By default this sends a confirmation email - you will not see new members
// until the link contained in it is clicked!
$retval = $api->listSubscribe( $listId, $email, $merge_vars );

if ($api->errorCode){
	if ($production) {
		$output = array("result" => "error");
	}
	else {		
		echo "Unable to load listSubscribe()!\n";
		echo "\tCode=".$api->errorCode."\n";
		echo "\tMsg=".$api->errorMessage."\n";	
	}
} else {
	if ($production) {
		// $output = array("result" => "success");
	}
	else {
	    echo "Subscribed - look for the confirmation email!\n";		
	}
}

// echo json_encode($output);

?>
