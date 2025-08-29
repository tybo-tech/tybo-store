<?php
include_once '../../config/Connection.php';
require_once '../../models/VariationOption.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));
$id = isset($data->id) ? $data->id : null;

if (!$id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing option ID']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$option = new VariationOption($db);
$success = $option->update($id, $data);

echo json_encode([
  'status' => 'success',
  'data' => ['success' => $success]
]);
