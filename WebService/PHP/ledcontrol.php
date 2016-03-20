<?php

/* print_r($_SERVER['QUERY_STRING']); */
/* sudo apt-get install php-apc */
/* sudo /etc/init.d/apache2 restart */

$apcname = "ControllerPosition";

$leds = array(
	"led0" => false,
	"led1" => false,
	"led2" => false
);

# load the apc store for tihis
if(apc_exists($apcname)) {
	
} else {
	
}


exec ( "gpio mode 0 out" );
exec ( "gpio mode 1 out" );
exec ( "gpio mode 2 out" );



for($i = 0 ; $i <= 2 ; $i++) {
	echo '<div>Pin ' . $i . htmlspecialchars($_GET["led".$i]) . '</div>';	
		
	if  ($_GET["led".$i] == "on") {
		exec ("gpio write ".$i." 1");
	} else {
		exec ("gpio write ".$i." 0");
	}	
	
}

?>
