<?php
include_once '../../config/Connection.php';
require_once '../../models/Variation.php';

header('Content-Type: application/json');

$company_id = isset($_GET['company_id']) ? $_GET['company_id'] : null;

if (!$company_id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing company_id']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$variation = new Variation($db);
$data = $variation->list($company_id);

echo json_encode([
  'status' => 'success',
  'data' => $data
]);
