<?php
include_once '../../config/Connection.php';
require_once '../../models/VariationOption.php';

header('Content-Type: application/json');

$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
  echo json_encode(['status' => 'error', 'message' => 'Missing option ID']);
  exit;
}

$connection = new Connection();
$db = $connection->connect();

$option = new VariationOption($db);
$data = $option->get($id);

if ($data) {
  echo json_encode(['status' => 'success', 'data' => $data]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Option not found']);
}
