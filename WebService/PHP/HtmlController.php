<?php

	$apcname = "ControllerPosition";
	apc_store($apcname, file_get_contents('php://input'));
	echo file_get_contents('php://input');

?>
