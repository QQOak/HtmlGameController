<?php

$apcname = "ControllerPosition";
$controllerPosition = NULL;

if(apc_exists($apcname)) {

	$controllerPosition = apc_fetch($apcname);
	print($controllerPosition);

} else {
	
	# create an empty controller object for us to return
	#print("No Controller Position Available");

	#$controllerPosition = json_encode(["Hello!","Goodbye", [1, 2, 3]], JSON_FORCE_OBJECT);
	
	$neautralstick = array('id' => 1, 'xaxis' => 0, 'yaxis' => 0, 'direction' => 0, 'magnitude' => 0);
	
	
	
	$controllerPosition = json_encode($neautralstick, JSON_FORCE_OBJECT);
	print($controllerPosition);
	
	#id
	#xaxis
	#yaxis
	#direction
	#magnitude
	
	
}

#var_dump($controllerPosition);

?>
