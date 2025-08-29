<?php
include_once '../../config/Connection.php';
include_once '../../models/InitDatabase.php';

$connection = new Connection();
$db = $connection->connect();

$service = new InitDatabase($db);
$tablesResult = $service->createTables();
echo json_encode($tablesResult);
