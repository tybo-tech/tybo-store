<?php
include_once '../../config/Connection.php';
include_once '../../models/TyboWebsite.php';
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(['error' => 'Invalid request']);
    return;
}
if (!is_array($data)) {
    echo json_encode(['error' => 'Section must be an array']);
    return;
}
$connection = new Connection();
$db = $connection->connect();

$service = new TyboWebsite($db);
foreach($data as $section){
    $tablesResult = $service->updateSection($section);
}
echo json_encode($tablesResult);
