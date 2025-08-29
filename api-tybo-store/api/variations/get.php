<?php
include_once '../../config/Connection.php';
require_once '../../models/Variation.php';

header('Content-Type: application/json');

$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing variation ID']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$variation = new Variation($db);
$data = $variation->get($id);

if ($data) {
  echo json_encode(['status' => 'success', 'data' => $data]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Variation not found']);
}
