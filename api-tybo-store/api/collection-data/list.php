<?php
// api/collection-data/list.php
include_once '../../config/Connection.php';
include_once '../../models/CollectionDataQuery.php';

if (!isset($_GET['collection'])) {
    echo json_encode(["error" => "Missing collection name"]);
    exit;
}

$collection = $_GET['collection'];
$Connection = new Connection();
$db = $Connection->connect();

$service = new CollectionDataQuery($db);
$result = $service->getAllByCollectionName($collection);

echo json_encode($result);
