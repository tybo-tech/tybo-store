<?php
include_once '../../config/Connection.php';
require_once '../../models/VariationOption.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));
if (!$data || !isset($data->variation_id) || !isset($data->name)) {
  echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
  exit;
}
$connection = new Connection();
$db = $connection->connect();
$option = new VariationOption($db);
$item = $option->add($data);

echo json_encode([
  'status' => 'success',
  'data' => $item
]);