<?php
include_once '../../config/Connection.php';
require_once '../../models/Variation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));
$id = isset($data->id) ? $data->id : null;

if (!$id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing variation ID']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$variation = new Variation($db);
$success = $variation->update($id, $data);

echo json_encode([
  'status' => $success ? 'success' : 'error',
  'message' => $success ? 'Variation updated' : 'Update failed'
]);
