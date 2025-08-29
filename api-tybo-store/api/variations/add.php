<?php
include_once '../../config/Connection.php';
require_once '../../models/Variation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));
if(!$data || !isset($data->name) || !isset($data->type) || !isset($data->company_id)) {
  echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
  exit;
}
$connection = new Connection();
$db = $connection->connect();

$variation = new Variation($db);
$id = $variation->add($data);

echo json_encode([
  'status' => 'success',
  'message' => 'Variation added',
  'id' => $id
]);
