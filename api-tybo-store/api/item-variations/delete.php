<?php
include_once '../../config/Connection.php';
require_once '../../models/ItemVariation.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'));
$item_id = $data->item_id ?? null;
$item_type = $data->item_type ?? null;

if (!$item_id || !$item_type) {
  echo json_encode(['status' => 'error', 'message' => 'Missing item_id or item_type']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$itemVariation = new ItemVariation($db);
$success = $itemVariation->deleteByItem($item_id, $item_type);

echo json_encode([
  'status' => $success ? 'success' : 'error',
  'message' => $success ? 'Item variation mappings deleted' : 'Delete failed'
]);
