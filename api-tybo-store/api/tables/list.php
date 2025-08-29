<?php

include_once '../../config/Connection.php';
include_once '../../models/TableCreator.php';
// include_once '../../models/Authenticator.php';

$connection = new Connection();
// $authenticator = new Authenticator($connection);

// // Perform authentication
// $authenticator->authenticate();

// Continue with the rest of your script

// Example: Get the list of tables
$db = $connection->connect();
$service = new TableCreator($db);
$tablesResult = $service->getListofTables();
echo json_encode($tablesResult);

?>
