<?php

include_once '../config/Connection.php';
include_once '../models/Crud.php';
$lat1 = $_GET['lat1'];
$lng1 = $_GET['lng1'];
$lat2 = $_GET['lat2'];
$lng2 = $_GET['lng2'];
$company_id = $_GET['company_id'] ?? 10;

if (!$company_id) {
    echo json_encode(['error' => 'Invalid or missing company_id']);
    return;
}

if (empty($lat1)) {
    echo json_encode(['error' => 'You must provide lat1, lng1, lat2 and lng2']);
    return;
}
$connection = new Connection();
$db = $connection->connect();
$service = new Crud($db);
$distance = $service->haversineDistance($lat1, $lng1, $lat2, $lng2);
$ranges = $service->getAll($company_id, 'markup_ranges');
echo json_encode(['distance' => $distance, 'ranges' => $ranges]);
