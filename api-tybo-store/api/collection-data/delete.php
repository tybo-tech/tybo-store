<?php
// api/companies/delete.php
include_once '../../config/Connection.php';
include_once '../../models/CollectionDataMutation.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

$Connection = new Connection();
$db = $Connection->connect();

$service = new CollectionDataMutation($db);
$result = $service->remove($_GET['id']);

if ($result) {
    echo json_encode(["message" => "Component deleted successfully"]);
} else {
    echo json_encode(["error" => "Failed to delete Component"]);
}
