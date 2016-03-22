<?php

$apcname = "ControllerPosition";
apc_store($apcname, file_get_contents('php://input'));
echo file_get_contents('php://input');








#$json = '{"id":"gameController1","thumbstickValues":[{"id":"LeftStick","xAxis":0,"yAxis":0,"direction":0,"magnitude":0}],"digitalButtonValues":[]}';
#var_dump(json_decode($json));





#$leftAnalogueStick = json_decode($json);
#echo json_encode($leftAnalogueStick);
#var_dump($leftAnalogueStick);


#echo file_get_contents('php://input');



#print $leftAnalogue

/*
           

$controllerPosition = "";
$controllerPosition = apc_fetch($apcname);



if(apc_exists($apcname)) {
	
} else {
	$controllerPosition = "None found";
}
var_dump($controllerPosition);

*/

?>
