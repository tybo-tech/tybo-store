<?php

include_once '../../config/Connection.php';
include_once '../../models/TableCreator.php';
include_once '../../models/Authenticator.php';

$data = json_decode(file_get_contents("php://input"));
$connection = new Connection();
$authenticator = new Authenticator($connection);

// Perform authentication
$authenticator->authenticate();

$db = $connection->connect();
$service = new TableCreator($db);
$result = $service->createTable($data->TableName, $data->Columns);

echo json_encode($result);
