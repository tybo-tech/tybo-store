<?php
include_once '../../config/Connection.php';
require_once '../../models/ItemVariation.php';

header('Content-Type: application/json');

$item_id = $_GET['item_id'] ?? null;
$item_type = $_GET['item_type'] ?? null;

if (!$item_id || !$item_type) {
  echo json_encode(['status' => 'error', 'message' => 'Missing item_id or item_type']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$itemVariation = new ItemVariation($db);
$data = $itemVariation->listForItem($item_id, $item_type);

echo json_encode([
  'status' => 'success',
  'data' => $data
]);
