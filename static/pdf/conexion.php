<?php
$mysqli = new mysqli("localhost","root","","basemunicipios");
 
if ($mysqli->connect_errno)
   header('Location: /');

$mysqli->set_charset('utf8');

return $mysqli;