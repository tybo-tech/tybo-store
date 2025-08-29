<?php
include_once '../../config/Connection.php';
include_once '../../models/ProductImportService.php';

$payload = json_decode(file_get_contents("php://input"));

if (!$payload || !isset($payload->categories) || !isset($payload->products)) {
    echo json_encode(['success' => false, 'error' => 'Invalid request format. Expected categories and products.']);
    return;
}

$connection = new Connection();
$db = $connection->connect();

try {
    $service = new ProductImportService($db);
    $result = $service->import($payload);

    // ✅ Just return the result from the service as-is
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
