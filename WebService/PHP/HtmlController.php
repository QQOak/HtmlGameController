<?php


$apcname = "ControllerPosition";
$controllerPosition = "";
$controllerPosition = apc_fetch($apcname);


if(apc_exists($apcname)) {
	
} else {
	$controllerPosition = "None found";
}
var_dump($controllerPosition);


?>
