<?php

$apcname = "ControllerPosition";

if(apc_exists($apcname)) {
	$controllerPosition = apc_fetch($apcname);
	print $controllerPosition;
} else {
}
#var_dump($controllerPosition);


?>
