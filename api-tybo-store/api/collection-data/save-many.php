<?php
// api/collection-data/save.php

include_once '../../config/Connection.php';
include_once '../../models/CollectionDataMutation.php';

$listOfItems = json_decode(file_get_contents("php://input"));

// Validate input
if (!$listOfItems || !is_array($listOfItems)) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

// Initialize DB connection and service
$Connection = new Connection();
$db = $Connection->connect();
$service = new CollectionDataMutation($db);

// Call addMany and return results
$result = $service->addMany($listOfItems);
echo json_encode($result);
