<?php
include_once '../../config/Connection.php';
require_once '../../models/ItemVariation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));

$connection = new Connection();
$db = $connection->connect();

$itemVariation = new ItemVariation($db);
$id = $itemVariation->add($data);

echo json_encode([
    'status' => 'success',
    'message' => 'Item variation mapping added',
    'id' => $id
]);
