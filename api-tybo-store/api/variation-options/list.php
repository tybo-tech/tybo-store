<?php
include_once '../../config/Connection.php';
require_once '../../models/VariationOption.php';

header('Content-Type: application/json');

$variation_id = isset($_GET['variation_id']) ? $_GET['variation_id'] : null;

if (!$variation_id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing variation_id']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$option = new VariationOption($db);
$data = $option->list($variation_id);

echo json_encode([
  'status' => 'success',
  'data' => $data
]);
