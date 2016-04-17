<?php

$apcname = "ControllerPosition";
$controllerPosition = NULL;

if(apc_exists($apcname)) {

	$controllerPosition = apc_fetch($apcname);
	print($controllerPosition);

} else {
	
	# create an empty controller object for us to return
	
	$leftStick = array('id' => 'LeftStick', 'xAxis' => 0, 'yAxis' => 0, 'direction' => 0, 'magnitude' => 0);
	$rightStick = array('id' => 'RightStick', 'xAxis' => 0, 'yAxis' => 0, 'direction' => 0, 'magnitude' => 0);
	$controller = array('id' => 0, 'thumbstickValues' => array('LeftStick' => $leftStick, 'RightStick' => $rightStick));
	
	$controllerPosition = json_encode($controller, JSON_FORCE_OBJECT);
	print($controllerPosition);
	
}

?>
