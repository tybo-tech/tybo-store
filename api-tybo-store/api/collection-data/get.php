<?php
// api/collection-data/get.php
include_once '../../config/Connection.php';
include_once '../../models/CollectionDataQuery.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(["error" => "Missing or invalid id"]);
    exit;
}

$id = (int) $_GET['id'];
$Connection = new Connection();
$db = $Connection->connect();

$service = new CollectionDataQuery($db);
$result = $service->getById($id);

echo json_encode($result);
